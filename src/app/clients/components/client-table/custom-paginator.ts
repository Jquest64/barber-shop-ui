import { Inject, Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";

@Injectable({
    providedIn: "root",
})
export class CustomPaginator extends MatPaginatorIntl {
    override itemsPerPageLabel = 'Itens por página';
    override nextPageLabel = 'Próxima Página';
    override previousPageLabel = 'Página anterior';
    override firstPageLabel = 'Primeira páginna';
    override lastPageLabel = 'Última página';
    
}