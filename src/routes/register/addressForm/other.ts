import { autofill, config } from "@mapbox/search-js-web"
import type { PageLoad } from './$types';

export const load:PageLoad = (async () => {
   config.accessToken = "pk.eyJ1IjoiZXJpY2JyYW5zb24iLCJhIjoiY20wYjh6b29yMDE4dDJqb2sxc3ZjZHgzMyJ9.3kAYNtGfsqEPi8a3Zlvlzg"
   autofill({
      options: {
         country: 'us'
      }  
   })
   return {};
}) 