import { Observable } from "rxjs";
import { DetailClientResponse, ListClientResponse, SaveClientRequest, SaveClientResponse, UpdateClientRequest, UpdateClientResponse } from "./client.models";

export interface ICLientService {
    save(request: SaveClientRequest): Observable<SaveClientResponse>;

    update(id: number, request: UpdateClientRequest): Observable<UpdateClientResponse>;

    delete(id: number): Observable<void>;

    List(): Observable<ListClientResponse[]>

    findByID(id: number): Observable<DetailClientResponse>

}