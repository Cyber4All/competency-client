import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Documentation } from 'src/entity/documentation';
import { COMPETENCY_ROUTES } from 'src/environments/routes';
import { AuthService } from './auth.service';

// the typing of the Lambda response when uploading a file
interface Lambda {
  url: string,
  fields: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'AWSAccessKeyId': string,
    'key': string,
    'policy': string,
    'signature': string,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'x-amz-security-token': string
  }
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Logic for uploading a file to S3 and in the API
   *
   * @param competencyId the competency where the file will be uploaded
   * @param file the file to be uploaded
   * @param description the description to add to the documentation
   */
  async uploadFile(competencyId: string, file: File, description: string) {
    this.authService.initHeaders();
    const lambdaResponse: Lambda = await this.uploadLambdaService(competencyId, file);

    // format the lambda response
    const formData = new FormData();
    for (const [name, value] of Object.entries(lambdaResponse.fields)) {
      formData.append(name, value);
    }
    formData.append('file', file);

    // Adds the file to S3
    await lastValueFrom(this.http.post(lambdaResponse.url, formData)).catch(e => {
      console.log(e); // TODO: Swap for toaster component
    });

    // formats the uri to be stored in mongo, will be used for file retrieval and deleting a file
    const fileURL = `https://cc-file-upload-bucket.s3.amazonaws.com/${this.authService.user?._id}/${competencyId}/${file.name}`;

    await lastValueFrom(
      this.http.post(
        COMPETENCY_ROUTES.CREATE_DOCUMENTATION(competencyId),
        {
          userId: this.authService.user?._id,
          description: description,
          uri: fileURL,
        },
        { headers: this.authService.headers, withCredentials: true, responseType: 'json' }
      )
    ).then(res => {
      console.log('Documentation created!', res); // TODO: Swap for toaster component
    }).catch(e => {
      console.log(e); // TODO: Swap for toaster component
    });
  }

  /**
   * Logic for deleting documentation in the API and the file in S3
   *
   * @param competencyId The competency where the file will be deleted
   * @param documentation a single documentation or an array of documentations that will be deleted
   */
  async deleteFile(competencyId: string, documentation: Documentation | Documentation[]) {
    this.authService.initHeaders();
    const docsToDelete = (documentation instanceof Array) ? documentation : [documentation];
    const fileNameQuery = docsToDelete.map(doc => this.parseFileName(doc.uri)).join(',');
    const LambdaResponse: { urls: string[] } = await this.deleteLambdaService(competencyId, fileNameQuery);
    await Promise.all(LambdaResponse.urls.map(url => {
      try {
        lastValueFrom(this.http.delete(url)).then(res => {
          console.log(res); // TODO: Swap for toaster component, this is a success toaster
        });
      } catch (error) {
        console.log(error); // TODO: Swap for toaster component
      }
    }));
    await lastValueFrom(
      this.http.delete(
        COMPETENCY_ROUTES.DELETE_DOCUMENTATION(competencyId),
        {
          params: {
            ids: docsToDelete.map(doc => doc._id)
          },
          headers: this.authService.headers,
          withCredentials: true,
          responseType: 'json'
        }
      )
    ).then(res => {
      console.log('Documentation deleted!'); // TODO: Swap for toaster component
    }).catch(e => {
      console.log(e); // TODO: Swap for toaster component
    });
  }

  /**
   * Takes the uri linked to S3 and retrieves the filename
   *
   * @param uri the Uniform Resource Identifier of the file in S3 containing the filename
   * @returns The filename
   */
  public parseFileName(uri: string): string {
    const uriSplit = uri.split('/');
    return uriSplit[uriSplit.length - 1];
  }

  /**
   * Communicates with File Upload in Lambda to generate a presigned url
   * to upload a file to S3
   *
   * @param competencyId The id of the competency containing the file to be uploaded
   * @param file The file to be uploaded
   * @returns A presigned url that adds the file to s3 and fields to attach to the request (see Lambda type for more info)
   */
  private async uploadLambdaService(competencyId: string, file: File): Promise<any> {
    return await lastValueFrom(
        this.http.post(
          COMPETENCY_ROUTES.UPLOAD_FILE_LAMBDA(competencyId),
          {
            filename: file?.name,
            filesize: file?.size,
            extension: file?.name.split('.').pop()
          },
          { headers: this.authService.headers, withCredentials: true, responseType: 'json' }
        )
      ).then((res) => {
        return res;
      }).catch(e => {
        console.log(e); // Swap for toaster component
      });
  }

  /**
   * Communicates with File Upload in Lambda to generate presigned urls
   * to delete files in S3 given the filenames to be deleted
   *
   * @param competencyId The id of the competency containing the file to be deleted
   * @param filenames A comma separated string of filenames to be deleted
   * @returns An array of urls used to delete each file in s3
   */
  private async deleteLambdaService(competencyId: string, filenames: string): Promise<any> {
    return await lastValueFrom(
      this.http.delete(
        COMPETENCY_ROUTES.DELETE_FILE_LAMBDA(competencyId, filenames),
        {
          headers: this.authService.headers,
          withCredentials: true,
          responseType: 'json',
        }
      )
    ).then((res) => {
      return res;
    }).catch(e => {
      console.log(e); // Swap for toaster component
    });
  }
}
