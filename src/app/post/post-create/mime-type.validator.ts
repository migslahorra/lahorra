import { AbstractControl } from '@angular/forms';  
import { Observable, Observer } from 'rxjs';  

export const mimetype = (
  control: AbstractControl
): Promise<{ [key: string]: any } | null> | Observable<{ [key: string]: any } | null> => {
  if (!control.value || typeof control.value === 'string') {
    return new Observable(observer => {
      observer.next(null);
      observer.complete();
    });
  }

  const file = control.value as File;
  const fileReader = new FileReader();
  const observable = new Observable<{ [key: string]: any } | null>((observer: Observer<{ [key: string]: any } | null>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = "";
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      let isValid = false;
      switch (header) {
        case "89504e47": // PNG
        case "ffd8ffe0": // JPEG
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });

  return observable;
};
