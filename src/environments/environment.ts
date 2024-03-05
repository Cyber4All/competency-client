// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  experimental: false,
  apiURL: 'http://localhost:3000',
  fileUploadURL: 'https://3f6r4t6ofib4pvujqtyjahdz4q0oryzc.lambda-url.us-east-1.on.aws',
  host: 'localhost',
  cardOrganizationUrl: 'https://api-gateway.caeresource.directory/organizations?type=&verified=verified&mine=&sort=',
  tinyKey: '3fkli5rzzx1lcmqsbo8n6kok6ym0yc67wdpek4h1j37jg47q'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
