import { ComponentType } from "@angular/cdk/overlay";
import { YesNoDialogComponent } from "../commons/components/yes-no-dialog/yes-no-dialog.component";
import { Observable } from "rxjs";

export interface IDialogManagerService {
    showYesNoDialog(Component: ComponentType<YesNoDialogComponent>, data: { title: string, content: string }): Observable<any>;
}