import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { COMPETENCY_ROUTES } from 'src/environments/routes';
import { AuthService } from './auth.service';

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

  async uploadFile(competencyId: string, file: File, description: string) {
    this.authService.initHeaders();
    const lambdaResponse: Lambda = await this.lambdaService(competencyId, file, 'post');

    // format the give response
    const formData = new FormData();
    for (const [name, value] of Object.entries(lambdaResponse.fields)) {
      formData.append(name, value);
    }
    console.log('formData', formData);
    await lastValueFrom(
      this.http.post(lambdaResponse.url, formData)
    ).then((res) => {
      console.log('Lambda Response', res);
    });

    // await lastValueFrom(
    //   this.http.post(
    //     COMPETENCY_ROUTES.CREATE_DOCUMENTATION(competencyId),
    //     {
    //       userId: this.authService.user?._id,
    //       description: description,
    //       uri: '', // to be implemented once Lambda route works in prod
    //     },
    //     { headers: this.authService.headers, withCredentials: true, responseType: 'json' }
    //   )
    // ).then((res) => {
    //   // returns the id of the documentation object
    // });
  }

  async deleteFile(competencyId: string, documentationIds: string | string[]) {
    const documentationParams = (documentationIds instanceof Array) ? documentationIds : [documentationIds];
    this.authService.initHeaders();
    //figure out deleting a file through lambda
    // const lambdaResponse = await this.lambdaService(competencyId, documentationIds, 'delete');
    // get the delete s3 link and use it to delete the file
    // once confirmed, delete the file in our db (below)
    await lastValueFrom(
      this.http.delete(
        COMPETENCY_ROUTES.DELETE_DOCUMENTATION(competencyId),
        {
          params: {
            ids: documentationParams
          },
          headers: this.authService.headers,
          withCredentials: true,
          responseType: 'json'
        }
      )
    );
  }

  private async lambdaService(competencyId: string, file: File, method: 'delete' | 'post'): Promise<any> {
    return await lastValueFrom(
      method === 'post' ?
        this.http.post(
          COMPETENCY_ROUTES.UPLOAD_FILE_LAMBDA(competencyId),
          {
            filename: file.name,
            filesize: file.size,
            extension: file.name.split('.').pop()
          },
          { headers: this.authService.headers, withCredentials: true, responseType: 'json' }
        ) :
        this.http.delete(
          COMPETENCY_ROUTES.UPLOAD_FILE_LAMBDA(competencyId),
          {
            headers: this.authService.headers,
            withCredentials: true,
            responseType: 'json',
            body: {
              filename: file.name
            }
          }
        )
      ).then((res) => {
        console.log('Lambda Response', res);
        return res;
      });
  }
}
