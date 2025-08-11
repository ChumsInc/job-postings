interface JobLocationType {
    streetAddress: string,
    addressLocality: string,
    addressRegion: string,
    postalCode: string,
    addressCountry: string,
}

const Hurricane: JobLocationType = {
    streetAddress: '104 S. Main Street',
    addressLocality: 'Hurricane',
    addressRegion: 'UT',
    postalCode: '84737',
    addressCountry: 'US'
}

const SLC: JobLocationType = {
    streetAddress: '2424 South 2570 West',
    addressLocality: 'West Valley City',
    addressRegion: 'UT',
    postalCode: '84119',
    addressCountry: 'US'
}

const Ketchum: JobLocationType = {
    streetAddress: '210 East Sun Valley Road',
    addressLocality: 'Ketchum',
    addressRegion: 'ID',
    postalCode: '83340',
    addressCountry: 'US'
}

export const jobLocationLD = (name: string): JobLocationType => {
    switch (name) {
        case 'hurricane':
            return Hurricane;
        case 'ketchum':
            return Ketchum;
        case 'slc':
        default:
            return SLC;
    }
}
