import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { EstadosBr } from '../models/estados-br';


@Injectable()
export class DropdownService {
  constructor(private http: HttpClient) {}

  getEstadosBr() {
    return this.http
      .get('assets/dados/estadosbr.json')
      .pipe();
  }
}