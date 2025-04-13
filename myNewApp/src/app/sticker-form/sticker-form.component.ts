import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PutstickerService } from '../service/putsticker.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
import { StickerDetail } from '../model/stickerdetail';


@Component({
  selector: 'app-sticker-form',
  standalone: true,
  imports:
    [MatFormFieldModule,
      MatSelectModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      FormsModule],
  templateUrl: 'sticker-form.component.html',
  styleUrl: './sticker-form.component.css'
})
export class StickerFormComponent {
  fileName: String = "";
  sticker!: File;
  choosen: boolean | undefined;
  putstickerService: PutstickerService = inject(PutstickerService);
  form: NgForm | undefined;
  stickerDetail: StickerDetail = {
    club: '',
    league: '',
    id: 0,
    address: '',
    country: '',
    sticker: '',
    isClean: true,
    userId: 1
  };

  fileChoosen(event: any, fileList: FileList | null) {
    if (!fileList || fileList.length <= 0) {
      alert('No file selected!');
      return;
    }
    if (event.target.value) {
      this.fileName = "uploaded";
      this.sticker = fileList[0];
    }
  }

  onSubmit = async (form: NgForm): Promise<void> => {
    if (form.value) {
      const formValues: StickerDetail = {
        id: 0,
        club: form.value.club,
        league: form.value.league,
        address: form.value.address,
        country: form.value.country,
        isClean: form.value.isClean,
        sticker: "sticker",
        userId: 1
      };
      try {
        const response = this.putstickerService.uploadImage(this.sticker, formValues);
        alert('You put new sticker!!');
      } catch (error) {
        console.error('There was an error!', error);
        alert(error);
      }
    }
  }
}
