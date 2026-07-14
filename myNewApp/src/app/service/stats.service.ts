import { Injectable } from '@angular/core';
import { apiGet } from './api-client';

export interface ClubStat {
    clubId: number;
    count: number;
    latestAt: string | null;
    latestSticker: string | null;
}

export interface RankingEntry {
    clubId: number;
    count: number;
}

export interface PrefectureStat {
    state: string;
    total: number;
    clubs: { clubId: number; count: number }[];
}

export interface HeatmapResponse {
    points: { latitude: number; longitude: number }[];
    prefectures: { state: string; count: number }[];
}

export interface TerritoryCell {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
    clubId: number;
    count: number;
    total: number;
}

export interface CityTerritory {
    city: string;
    state: string;
    total: number;
    topClubId: number;
    topCount: number;
    latitude: number;
    longitude: number;
}

export interface MapBounds {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
}

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    getClubStats(): Promise<ClubStat[]> {
        return apiGet('/stats/clubs');
    }

    getRanking(bounds: MapBounds): Promise<RankingEntry[]> {
        return apiGet('/stats/ranking', bounds);
    }

    getPrefectureStats(): Promise<PrefectureStat[]> {
        return apiGet('/stats/prefectures');
    }

    getHeatmap(clubId?: number | null): Promise<HeatmapResponse> {
        return apiGet('/stats/heatmap', clubId ? { clubId } : undefined);
    }

    getTerritory(cellSize: number = 0.05): Promise<{ cellSize: number; cells: TerritoryCell[] }> {
        return apiGet('/stats/territory', { cell: cellSize });
    }

    getCityTerritory(): Promise<CityTerritory[]> {
        return apiGet('/stats/territory/cities');
    }
}
