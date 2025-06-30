import { Injectable } from '@angular/core';
import axios from 'axios';
import { Pin } from '../model/pin';
import { clubMap, leagueMap } from '../const/clubMaps';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    private dataUrl = 'http://localhost:3000/maps';

    getAllPins = async (): Promise<Pin[]> => {
        try {
            const response = await axios.get(this.dataUrl + '/getAllPins');
            const pins: Pin[] = response.data.map((item: any) => {
                return {
                    latitude: item.latitude,
                    longitude: item.longitude,
                    club: clubMap.get(item.clubId),
                    league: leagueMap.get(item.leagueId),
                    isClean: item.isClean,
                    sticker: item.sticker,
                    userId: item.userId, // 仮のユーザーID
                    id: item.id // 仮のID
                };
            })
            return pins;
        } catch (error) {
            console.error('Error fetching stickers:', error);
            throw error;
        }
    }
}