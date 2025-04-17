import { InjectionToken } from "@angular/core";
import { ICLientService } from "./api-client/clients/iclients.service";
import { ISnackbarManagerService } from "./isnackbar-manager.service";

export const SERVICES_TOKEN = {
    HTTP : {
        CLIENT: new InjectionToken<ICLientService>('SERVICES_TOKEN.HTTP.CLIENT'),
        //SCHEDULE: new InjectionToken<ScheduleService>('SERVICES_TOKEN.HTTP.SCHEDULE')
    },
    SNACKBAR: new InjectionToken<ISnackbarManagerService>('SERVICES_TOKEN.SNACKBAR')
}