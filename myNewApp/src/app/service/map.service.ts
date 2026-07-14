import { Injectable } from '@angular/core';
import { Pin, PinFilter } from '../model/pin';
import { clubMap, countryMap, leagueMap } from '../const/clubMaps';
import { apiGet } from './api-client';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    async getAllPins(filter: PinFilter = {}): Promise<Pin[]> {
        const params: Record<string, number> = {};
        if (filter.clubId) params['clubId'] = filter.clubId;
        else if (filter.leagueId) params['leagueId'] = filter.leagueId;
        else if (filter.countryId) params['countryId'] = filter.countryId;

        const items = await apiGet<any[]>('/maps/getAllPins', params);
        return items.map((item) => this.toPin(item));
    }

    private toPin(item: any): Pin {
        const club = clubMap.get(item.clubId);
        const league = leagueMap.get(item.leagueId);
        const addressText = [item.state, item.city, item.district, item.neighbourhood]
            .filter((part: string | null) => !!part)
            .join(' ');

        return {
            id: item.id,
            latitude: item.latitude,
            longitude: item.longitude,
            club: club
                ? { clubId: item.clubId, ...club }
                : { clubId: item.clubId, clubName: 'Unknown', color1: '#888888', color2: '#cccccc' },
            league: league
                ? { leagueId: item.leagueId, leagueName: league.leagueName }
                : { leagueId: item.leagueId, leagueName: 'Unknown' },
            country: countryMap.get(item.countryId) ?? 'Unknown',
            isClean: item.isClean,
            sticker: item.sticker,
            userId: item.userId,
            createdAt: item.createdAt,
            postedBy: item.postedBy,
            comment: item.comment,
            addressText,
        };
    }
}
