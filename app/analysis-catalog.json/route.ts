import { FANTASY_PLAYER_POOL } from '@/data/fantasy-player-pool';
export const dynamic = 'force-static';
export function GET() {
 return Response.json({players:FANTASY_PLAYER_POOL.map(p=>({id:p.id,name:p.name,club:p.club,position:p.position,price:p.price}))});
}
