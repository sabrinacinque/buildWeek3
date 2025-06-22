import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private baseUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) { }

  // 🔄 UPLOAD VERO AL SERVER
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.baseUrl}/image`, formData);
  }

  // 🔄 GESTISCE SIA IMMAGINI LOCALI CHE CARICATE
  getImageUrl(filename: string): string {
    if (!filename) return '../../../assets/image/placeholder.jpg';
    
    // Se il filename contiene un UUID (immagini caricate sul server)
    if (this.isServerUploadedImage(filename)) {
      return `${environment.apiUrl}/upload/images/${filename}`;
    }
    
    // Altrimenti usa il path locale per immagini esistenti
    return `../../../assets/image/png/${filename}`;
  }

  // Verifica se è un'immagine caricata sul server (contiene UUID)
  private isServerUploadedImage(filename: string): boolean {
    // UUID pattern: 8-4-4-4-12 caratteri esadecimali + estensione
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp)$/i;
    return uuidPattern.test(filename);
  }
}