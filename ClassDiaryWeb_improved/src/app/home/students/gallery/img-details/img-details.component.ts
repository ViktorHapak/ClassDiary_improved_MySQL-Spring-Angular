import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Image} from "../../../../_models/image.model";
import {ImageService} from "../../../../_services/image.service";

@Component({
  selector: 'app-img-details',
  templateUrl: './img-details.component.html',
  styleUrls: ['./img-details.component.css']
})
export class ImgDetailsComponent {

  @Input() img: Image;
  @Input() id: string;

  @Output()
  imgClose: EventEmitter<null> = new EventEmitter();

  imgDetails: any;

  constructor(private imageService: ImageService) {
  }

  ngOnInit(): void {

    this.imageService.getById(this.id).subscribe({
      next: (data: any) => {
        this.imgDetails = data;
      },
      error: err => {
        this.close();
      }
    })

  }

  close(): void {
    this.imgClose.emit();
  }

  protected readonly Object = Object;
}
