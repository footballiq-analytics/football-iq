/** Only populate from a verified weekly source; no fabricated fixtures. */
export type WeeklyFixture={home:string;away:string};
export const CURRENT_MATCHWEEK:number|null=null;
export const WEEKLY_FIXTURES:readonly WeeklyFixture[]=[];
export function getClubFixture(club:string){
 const fixture=WEEKLY_FIXTURES.find(match=>match.home===club||match.away===club);
 if(!fixture)return null;
 return {venue:fixture.home===club?"Ev":"D",opponent:fixture.home===club?fixture.away:fixture.home};
}
