import { PipeTransform, Pipe } from '@angular/core';

// import { CorporateComponent } from '../corporate/corporate.component';
import * as _ from 'underscore';
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    doctorSearch = false;
    corporateSearch = false;
    groupSearch = false;
    transform(listToFilter: any[], searchText: string, fields?: string[], method = 'includes'): any[] {
        if (!listToFilter) { return []; }
        if (!searchText) { return _.map(listToFilter); }
        if (!fields) {

            return _.map(listToFilter).filter(element => {
                return Object.keys(element).find((key) => {
                    if (!!element[key] && (typeof element[key] === 'string' ||
                        typeof element[key] === 'number')) {
                        return element[key].toString().toLowerCase()[method](searchText.toLowerCase());
                    } else if (element[key] instanceof Object) {
                        return Object.keys(element[key]).find((subKey) => {
                            if (!!element[key][subKey] && (typeof element[key][subKey] === 'string'
                                || typeof element[key][subKey] === 'number')) {
                                return element[key][subKey].toString().toLowerCase()[method](searchText.toLowerCase());
                            }
                        });
                    }
                });
            });
        }
        if (!!fields && fields.length) {
            let filteredByField = [];
            listToFilter.forEach(element => {
                fields.forEach(field => {
                    const refObject = field.split(':')[0];
                    const refSubObject = field.split(':')[1];
                    if (field.includes(':') && element[refObject] &&
                        element[refObject][refSubObject].toString().toLowerCase()[method](searchText.toLowerCase())
                    ) {

                        filteredByField.push(element);
                    } else if (element[field] &&
                        element[field].toString().toLowerCase()[method](searchText.toLowerCase())) {
                        filteredByField.push(element);
                    }
                });
            });
            fields.forEach(field => {

                filteredByField = filteredByField.sort((a, b) => a[field].localeCompare(b[field]));
            });
            const temp = filteredByField
                .filter((filterD, i, self) => self.indexOf(filterD) === i);
            return temp;
        }
    }
}
