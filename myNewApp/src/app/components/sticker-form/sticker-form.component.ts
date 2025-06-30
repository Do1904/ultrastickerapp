import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PutstickerService } from '../../service/putsticker.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
import { StickerDetail } from '../../model/stickerdetail';
import { LocationService } from '../../service/location.service';
import { LatLngLiteral } from 'leaflet';
import { ActivatedRoute } from '@angular/router';
import { CLUBS, COUNTRIES, LEAGUES } from '../../const/club';
import { Club, League } from '../../model/football';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sticker-form',
  standalone: true,
  imports:
    [
      CommonModule,
      MatFormFieldModule,
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
    clubId: 0,
    leagueId: 0,
    id: 0,
    address: '',
    countryId: 0,
    sticker: '',
    isClean: true,
    userId: 1,
    coordinate: {
      lat: 0,
      lng: 0
    },
  };

  public countries = COUNTRIES;
  public leagues = LEAGUES;
  public clubs = CLUBS;

  selectedCountryId: number | null = null;
  selectedLeagueId: number | null = null;

  filteredLeagues: League[] = [];
  filteredClubs: Club[] = [];

  public currentCoordinate: LatLngLiteral = {
    lat: 0,
    lng: 0
  };

  locationService: LocationService = inject(LocationService);

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // クエリパラメータを取得
    this.route.queryParams.subscribe(params => {
      this.currentCoordinate.lat = Number(params['lat']);
      this.currentCoordinate.lng = Number(params['lng']);
    });
  }


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

  async getCurrentLocation(): Promise<any> {
    const coordinate = await this.locationService.getCurrentLocation();
    this.currentCoordinate = coordinate;
  }

  onCountryChange(countryId: number) {
    this.filteredLeagues = this.leagues.filter(league => league.countryId === countryId);
    this.filteredClubs = [];
    this.selectedLeagueId = 0;
    this.stickerDetail.leagueId = 0;
    this.stickerDetail.clubId = 0;
  }

  onLeagueChange(leagueId: number) {
    this.filteredClubs = this.clubs.filter(club => club.leagueId === leagueId);
    this.stickerDetail.clubId = 0;
  }

  onSubmit = async (form: NgForm): Promise<void> => {
    console.info('onSubmit called');
    if (form.value) {
      const formValues: StickerDetail = {
        id: 0,
        clubId: form.value.clubId,
        leagueId: form.value.leagueId,
        address: form.value.address,
        countryId: form.value.countryId,
        isClean: form.value.isClean,
        sticker: "sticker",
        userId: 1,
        coordinate: {
          lat: this.currentCoordinate.lat,
          lng: this.currentCoordinate.lng
        },
      };
      try {
        this.putstickerService.uploadImage(this.sticker, formValues);
        alert('You put new sticker!!');
      } catch (error) {
        console.error('There was an error!', error);
        alert(error);
      }
    }
  }
}
