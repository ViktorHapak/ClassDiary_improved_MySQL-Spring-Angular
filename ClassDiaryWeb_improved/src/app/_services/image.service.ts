import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {StorageService} from "./storage.service";
import {DemoService} from "./demo.service";
import {ImageFile} from "../_models/imagefile.model";
import {Image} from "../_models/image.model";
import {map} from "rxjs/operators";

const IMG_API = 'http://localhost:8080/api/images';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

const httpOptions_bin = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
  withCredentials: true
}

const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient, private storageService: StorageService, private demoService: DemoService) { }

  getAll(): Observable<any> {
    if (this.storageService.isDemoMode()) {
      return of(
        this.demoService.DEMO_IMAGEREGISTRIES.map(
          (_img: ImageFile) => ({
            id: _img.id,
            filename: _img.filename,
            filePath: _img.filename,
            extension: _img.extension,
            size: null
          })
        )
      );
    }
    else {
      return this.http.get<any>(IMG_API + '/all', httpOptions);
    }
  }

  uploadFile(file: File): Observable<any> {
    if (this.storageService.isDemoMode()) {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (
        file.size === 0 ||
        !allowedTypes.includes(file.type) ||
        !allowedExtensions.includes(extension)
      ) {
        return throwError(() => new HttpErrorResponse({
          status: 400,
          statusText: 'Bad Request',
          error: 'Nem támogatott fájltípus!'
        }));
      }

      return this.createFile(file);
    }
    else
    {
      const fileData = new FormData();
      fileData.append('file', file);

      return this.http.post<any>(
        IMG_API + '/',
        fileData,
        {
          withCredentials: true
        }
      );
    }
  }

  getDataById(id: string): Observable<Blob> {
    if (this.storageService.isDemoMode()) {
      const _image = this.demoService.DEMO_IMAGES.find((e: Image) => String(e.id) === String(id));

      if (!_image?.dataUrl) {
        return throwError(() => new Error('Image not found'));
      }

      return this.http.get(_image.dataUrl, {
        responseType: 'blob'
      });
    }
    else
      return this.http.get(IMG_API + '/bin/' + id, {
        responseType: 'blob'
      });
  }

  getById(id: string): Observable<any> {
    if (this.storageService.isDemoMode()) {
      const _image = this.demoService.DEMO_IMAGES.find((e: any) => e.id === id);
      const _imagefile = this.demoService.DEMO_IMAGEREGISTRIES.find((e: any) => e.id === id);

      if (!_image || !_imagefile) {
        return throwError(() => new Error('Image not found'));
      }

      return this.getDataById(id).pipe(
        map((blob: Blob) => ({
          id: id,
          name: _imagefile.filename,
          signature: 'non-signed',
          filePath: _imagefile.filePath,
          extension: _imagefile.extension,
          sclass: null,
          size: (blob.size / 1024).toFixed(2) + ' kB'
        }))
      );
    }
    else
      return this.http.get(IMG_API + '/' + encodeURIComponent(id),
        httpOptions
      );
  }

  getByTag(tag: string): Observable<any> {
    if (this.storageService.isDemoMode()) {
      return of(this.demoService.DEMO_IMAGEREGISTRIES
        .filter((_imageFile: ImageFile) => _imageFile.filename.trim().toLowerCase().includes(tag.trim().toLowerCase()))
        .map(
          (_imageFile: ImageFile) => ({
            id: _imageFile.id,
            name: _imageFile.filename,
            filePath: _imageFile.filePath,
            extension: _imageFile.extension,
            size: null
          })
        ));
    }
    else
      return this.http.get<any>(IMG_API + '/files/' + encodeURIComponent(tag),
        httpOptions
      );
  }

  getByName(filename: string): Observable<any> {
    if (this.storageService.isDemoMode()) {
      return of(this.demoService.DEMO_IMAGEREGISTRIES
        .filter((_imageFile: ImageFile) => _imageFile.filename.trim().toLowerCase().includes(filename.trim().toLowerCase()))
        .map(
          (_imageFile: ImageFile) => ({
            id: _imageFile.id,
            name: _imageFile.filename,
            signature: 'non-signed',
            filePath: _imageFile.filePath,
            extension: _imageFile.extension,
            sclass: 'null',
            size: null
          })
        ));
    }
    else
    return this.http.get<any>(IMG_API + '/filename/' + encodeURIComponent(filename),
      httpOptions
    );
  }

  getBySclass(sclassName: string): Observable<any> {
    if (this.storageService.isDemoMode()) {
      if (sclassName === null || sclassName === '' || sclassName === 'null') {
        return of(this.demoService.DEMO_IMAGEREGISTRIES.map(
          (_imageFile: ImageFile) => ({
            id: _imageFile.id,
            name: _imageFile.filename,
            signature: 'non-signed',
            filePath: _imageFile.filePath,
            extension: _imageFile.extension,
            sclass: 'null',
            size: null
          })
        ));
      }
      else {
        return of([]);
      }
    }
    else {
      return this.http.get<any>(
        IMG_API + '/class/' + encodeURIComponent(sclassName),
        httpOptions
      );
    }
  }

  synchronize(): Observable<any> {
    if (this.storageService.isDemoMode()) {
      return of({message: "Nem történt adatmódosítás!"})
    }
    else
      return this.http.post<any>(IMG_API + '/synch', httpOptions);
  }

  delete(id: string): Observable<any> {
    if (this.storageService.isDemoMode()) {
      const imageIndex = this.demoService.DEMO_IMAGES.findIndex(
        (e: Image) => e.id === id
      );

      if (imageIndex !== -1) {
        this.demoService.DEMO_IMAGES.splice(imageIndex, 1);
      }

      const registryIndex = this.demoService.DEMO_IMAGEREGISTRIES.findIndex(
        (e: ImageFile) => e.id === id
      );

      if (registryIndex !== -1) {
        this.demoService.DEMO_IMAGEREGISTRIES.splice(registryIndex, 1);
      }
      return of('')
    }
    else
      return this.http.delete<any>(`${IMG_API}/${id}`, httpOptions);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(IMG_API + '/all',httpOptions);
  }

  private getQueryParams(params: any): HttpParams {

    let queryParams: HttpParams = new HttpParams();

    for (let key in params) {
      if (params[key] !== undefined || params[key] !== null ) {
        queryParams.set(key, params[key]);
      }
    }

    return queryParams;
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const [header, base64] = dataUrl.split(',');
    const mimeType = header.match(/data:(.*?);base64/)?.[1] ?? 'image/png';

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: mimeType });
  }

  private createFile(file: File): Observable<any> {
    return new Observable<any>(observer => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const dataUrl = URL.createObjectURL(file);

          const dotIndex = file.name.lastIndexOf('.');

          let filename = dotIndex === -1
            ? file.name
            : file.name.substring(0, dotIndex);

          const extension = dotIndex === -1
            ? ''
            : file.name.substring(dotIndex).toLowerCase();

          if (!filename.trim()) {
            filename = '-';
          }

          const originalName = filename;
          let index = 1;

          const isOccupied = (name: string): boolean =>
            this.demoService.DEMO_IMAGEREGISTRIES.some(
              (_img: ImageFile) =>
                _img.filename === name &&
                _img.extension.toLowerCase() === extension
            );

          while (isOccupied(filename)) {
            filename = `${originalName}(${index})`;
            index++;
          }

          const ids = [
            ...this.demoService.DEMO_IMAGES.map(
              (_img: Image) => Number(_img.id)
            ),
            ...this.demoService.DEMO_IMAGEREGISTRIES.map(
              (_img: ImageFile) => Number(_img.id)
            )
          ];

          const id = Math.max(0, ...ids.filter(Number.isFinite)) + 1;

          const image = {id: id.toString(), dataUrl: dataUrl} as Image;

          const imageFile: ImageFile = {
            id: id.toString(),
            filename: filename + extension,
            filePath: dataUrl,
            extension: extension.replace('.', '')
          } as ImageFile;

          this.demoService.DEMO_IMAGES.push(image);
          this.demoService.DEMO_IMAGEREGISTRIES.push(imageFile);

          observer.next({message: 'A kép sikeresen feltöltve!', id: id});
          observer.complete();
        }
        catch (error) {
          observer.error(error);
        }
      };

      reader.onerror = () => {
        observer.error(reader.error);
      };

      reader.readAsDataURL(file);

      return () => {
        if (reader.readyState === FileReader.LOADING) {
          reader.abort();
        }
      };
    });
  }
}
