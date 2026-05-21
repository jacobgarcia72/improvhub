import TheatreResults from './theatre-results';
import EventResults from './event-results';

export default async function SearchResults({ params }: { params: {
    theatre?: string;
    state?: string;
    zipcode?: string;
    miles?: string;
    for?: 'theatres' | 'shows' | 'jams';
}}) {
    const theatreNameQuery = params?.theatre;
    const stateQuery = params?.state;
    const zipcodeQuery = params?.zipcode;
    const milesQuery = params?.miles;
    const searchFor = params?.for;

    return (
        <section className="flex flex-row flex-wrap gap-4 px-4 pb-4 justify-center min-h-[308px]">
            {searchFor === 'theatres' && (
                <TheatreResults
                    theatre={theatreNameQuery}
                    state={stateQuery}
                    zipcode={zipcodeQuery}
                    miles={Number(milesQuery)}
                />
            )}
            {searchFor && ['shows', 'jams'].includes(searchFor) && (
                <EventResults
                    eventType={searchFor}
                    theatre={theatreNameQuery}
                    zipcode={zipcodeQuery}
                    miles={Number(milesQuery)}
                />
            )}
        </section>
    )
}