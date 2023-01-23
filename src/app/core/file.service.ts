import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Documentation } from 'src/entity/Documentation';
import { COMPETENCY_ROUTES } from 'src/environments/routes';
import { AuthService } from './auth.service';

interface Lambda { // should I move this to entities?
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

  async uploadFile(competencyId: string, file: File, description: string) {
    this.authService.initHeaders();
    const lambdaResponse: Lambda = await this.uploadLambdaService(competencyId, file);
    console.log(lambdaResponse);

    // format the lambda response
    const formData = new FormData();
    for (const [name, value] of Object.entries(lambdaResponse.fields)) {
      formData.append(name, value);
    }
    formData.append('file', file);
    // Sends a POST request to add the file to the s3 bucket (provided in the lambda response url)
    await lastValueFrom(this.http.post(lambdaResponse.url, formData));

    // formats the uri to be stored in mongo, will be used for file retrieval and deleting a file
    const fileURL = `https://cc-file-upload-bucket.s3.amazonaws.com/${this.authService.user?._id}/${competencyId}/${file.name}`;
    console.log(fileURL);

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
    ).then((res) => {
      console.log(res);
    });
  }

  async deleteFile(competencyId: string, documentation: Documentation | Documentation[]) {
    this.authService.initHeaders();
    const docsToDelete = (documentation instanceof Array) ? documentation : [documentation];
    console.log(docsToDelete);
    const fileNameQuery = docsToDelete.map(doc => this.parseFileName(doc.uri)).join(',');
    console.log(fileNameQuery);
    const LambdaResponse: { urls: string[] } = await this.deleteLambdaService(competencyId, fileNameQuery);
    console.log(LambdaResponse);
    await Promise.all(LambdaResponse.urls.map(url => lastValueFrom(this.http.delete(url))));
    // for each documentation being deleted:
    //    grab the uri of the documentation
    //    parse the file name using parseFileName()
    //    send a request to lambda to delete the file
    //    receive a url to s3 to delete it
    //    delete the documentation in mongo
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
    );
  }

  public parseFileName(uri: string): string {
    const uriSplit = uri.split('/');
    return uriSplit[uriSplit.length - 1];
  }

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
        console.log('Lambda Response', res);
        return res;
      });
  }

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
      console.log('Lambda Response', res);
      return res;
    });
  }
}
