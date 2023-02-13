import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
    isVisible = true;
    message?: string = undefined;

    constructor(private router: Router) {}

    /**
     * sets the banner visibility to true
     *
     */
    displayBanner() {
      this.isVisible = true;
    }

    /**
     * sets the banner visibility to false
     *
     */
    hideBanner() {
      this.isVisible = false;
    }

    /**
     * sets visibility true or false based on the parameter 'visibility'
     *
     * @param visibility the visibility to be set to be true or false
     */
    setBanner(visibility: boolean) {
      this.isVisible = visibility;
    }

    /**
     * sets a meesage to to show in the banner
     *
     * @param message the meesage to be set to the banner
     */
    setBannerMessage(message: string) {
      this.message = message;
    }

    /**
     * redirect users the '/downtime' route
     *
     */
    setRoute() {
      this.router.navigate(['/downtime']);
    }
}
