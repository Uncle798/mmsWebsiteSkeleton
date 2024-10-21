import { serve } from '@upstash/qstash/svelte'
import { env } from '$env/dynamic/private';
import dayjs from 'dayjs';

export const POST = serve(
    async (context)=>{
        await context.run('1st step', () => {
            console.log('1st step run' + dayjs(new Date()).format('YY-MM-DD HH:mm'))
        });
        await context.run('2nd step', () => {
            console.log('2nd step' + dayjs(new Date()).format('YY-MM-DD HH:mm'))
        });
    },
    { env }
)