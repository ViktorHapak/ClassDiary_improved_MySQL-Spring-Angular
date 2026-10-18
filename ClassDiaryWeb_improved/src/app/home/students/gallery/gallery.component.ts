import {Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {StudentService} from "../../../_services/student.service";
import {ImageService} from "../../../_services/image.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ImageFile} from "../../../_models/imagefile.model";
import {Sclass} from "../../../_models/sclass.model";
import {Image} from "../../../_models/image.model";
import {firstValueFrom} from "rxjs";
import {StorageService} from "../../../_services/storage.service";
import {DemoService} from "../../../_services/demo.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {

  search_title: string;

  imageFiles: ImageFile[] = [];
  images: Image[] = [];
  hover_id : string|null = null;
  focus_id : string|null = null;
  focus_img : Image|null = null;

  errorMessage: string = '';
  notificationMessage: string = '';
  dragging = false;
  dragCounter = 0;

  @ViewChild('select') sclass_selector: ElementRef<any>;

  @Input() classNames: string[];

  @Output()
  galleryClose: EventEmitter<null> = new EventEmitter();

  constructor(private imageService: ImageService, private storageService: StorageService, private demoService: DemoService,
              private renderer: Renderer2) {
  }

  ngOnInit() {
    this.getImages();
  }

  private getImages(): void {
    this.imageService.getAll().subscribe({
      next: async (data: []) => {
        this.imageFiles = data.map((e: any) => {
          let {id, name, filePath, extension, size}: any = e;
          return {id, name, filePath, extension};
        });

        await this.getImageDatas();
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.message;
      }
    });
  }

  private async getImageDatas(): Promise<void> {
    this.images = [];

    for (const imageFile of this.imageFiles) {
      try {
        const blob = await firstValueFrom(
          this.imageService.getDataById(imageFile.id!)
        );

        if (this.storageService.isDemoMode()) {

          const _image: Image | undefined = this.demoService.DEMO_IMAGES
            .find((image: Image) => image.id === imageFile.id);

          if (!_image) {throw new Error('A kép nem található!');}

          const dataUrl = _image.dataUrl;

          this.images.push({
            id: _image.id,
            dataUrl: dataUrl
          });
        }
        else {
          const dataUrl = URL.createObjectURL(blob);

          this.images.push({
            id: imageFile.id,
            dataUrl: dataUrl
          });

        }
        this.errorMessage = '';

      } catch (err: any) {
        this.errorMessage = typeof err.error === 'string' ? err.error : 'A kép betöltése sikertelen!';
      }
    }
  }

  protected searchByClassName(event: string): void {

    if(event == 'all') this.getImages();
    else {
      this.imageService.getBySclass(event).subscribe({
        next: async (data: []) => {
          this.imageFiles = data.map((e: any) => {
            let {id, name, signature, filePath, extension, sclass}: any = e;
            return {id, name, filePath, extension};
          });

          await this.getImageDatas()
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  protected searchByTag(): void {
    if (this.search_title.length === 0) {this.search_title = ' '}
    this.imageService.getByTag(this.search_title).subscribe({
      next: async (data: []) => {
        this.imageFiles = data.map((e: any) => {
          let {id, name, signature, filePath, extension, sclass}: any = e;
          return {id, name, filePath, extension};
        })

        this.renderer.setProperty(this.sclass_selector.nativeElement, 'value', 'all');
        await this.getImageDatas()
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        if (err.status == 404) {
          this.renderer.setProperty(this.sclass_selector.nativeElement, 'value', 'all');
          this.imageFiles = [];
          this.images = [];
        }
      }
    })

  }

  protected searchByName(): void {
    if (this.search_title.length === 0) {this.search_title = ' '}
    this.imageService.getByName(this.search_title).subscribe({
      next: async (data: []) => {
        this.imageFiles = data.map((e: any) => {
          let {id, name, filePath, extension, size}: any = e;
          return {id, name, filePath, extension};
        });

        this.renderer.setProperty(this.sclass_selector.nativeElement, 'value', 'all');
        await this.getImageDatas()
      },
      error: (err) => {
        this.renderer.setProperty(this.sclass_selector.nativeElement, 'value', 'all');
        this.imageFiles = [];
        this.images = [];
        console.log(err);
      }
    })
  }

  protected loadImage(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.imageService.uploadFile(file).subscribe({
      next: () => {
        this.errorMessage = '';
        this.getImages();
        input.value = '';
      },
      error: async (err) => {
        this.setMessage('error', err.error);
        input.value = '';
      }
    });
  }

  protected removeImage(id: string): void {
    this.imageService.delete(id).subscribe({
      next: (data: []) => {
        this.getImages();
      },
      error: (err) => {
        this.setMessage('error', err.error);
      }
    })
  }

  protected synchronize(): void {
    this.imageService.synchronize().subscribe({
      next: (data: any) => {
        this.setMessage('notification', data.message)
      },
      error: (err) => {
        this.setMessage('error', err.error);
      }
    });
  }

  protected focus(event,img: Image, id: string): void {
      this.focus_img = img;
      this.focus_id = id;
      console.log(this.focus_img.dataUrl);
      console.log(this.focus_id);
  }

  close(): void {
    this.galleryClose.emit();
  }

  private async setMessage(type: 'notification' | 'error' , response: any): Promise<void> {
    switch (type) {
      case 'notification': {
        this.notificationMessage = typeof response === 'string' ? response : 'A művelet sikeres!';
        setTimeout(() => {
          this.notificationMessage = '';
          console.log('Notifying message has been removed');
        }, 5000);
        break;}
      case 'error': {
        this.errorMessage = typeof response === 'string' ? response : 'A művelet sikertelen!';
        setTimeout(() => {
          this.errorMessage = '';
          console.log('Error message has been removed');
        }, 5000);
        break;
      }
    }
  }

  dragEnter(event: DragEvent): void {

    event.preventDefault();
    event.stopPropagation();

    if (!event.dataTransfer?.types.includes('Files')) return;

    this.dragCounter++;
    this.dragging = true;

  }

  protected dragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  protected dragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!event.dataTransfer?.types.includes('Files')) {
      return;
    }

    this.dragCounter--;

    if (this.dragCounter <= 0) {
      this.dragCounter = 0;
      this.dragging = false;
    }
  }

  protected dropImage(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dragCounter=0;
    this.dragging = false;

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    this.imageService.uploadFile(file).subscribe({
      next: () => {
        this.errorMessage = '';
        this.getImages();
      },
      error: async (err) => {
        this.setMessage('error', err.error);
      }
    });
  }

  adminAccess() {
    if (this.storageService.hasAdminRole()) return true
    else return false;
  }

  anonymAccess() {
    if (this.storageService.isDemoMode()) return true;
    else return false;
  }

  protected readonly console = console;
  protected readonly event = event;
}
