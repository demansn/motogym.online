import {DataProvider} from "./DataProvider";
import {driversAPIAdapter} from "./driversAPIAdapter";
import {competitionsAPIAdapter} from "./competitionsAPIAdapter";
import {competitionTypesAPIAdapter} from "./competitionTypesAPIAdapter";

export function createDataProvider(uri) {
    const dataProvider = new DataProvider(uri);

    dataProvider.addResourceAPIAdapter('drivers', driversAPIAdapter);
    dataProvider.addResourceAPIAdapter('competitions', competitionsAPIAdapter);
    dataProvider.addResourceAPIAdapter('competitionsTypes', competitionTypesAPIAdapter);

    return dataProvider;
}
