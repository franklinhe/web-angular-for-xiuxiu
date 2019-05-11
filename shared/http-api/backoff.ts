/**
 * Exponential backoff is a technique in which you retry an API after failure, making the time in between retries longer after each consecutive failure, with a maximum number of retries after which the request is considered to have failed. This can be quite complex to implement with promises and other methods of tracking AJAX calls. With observables, it is very easy:
 */
import { pipe, range, timer, zip } from 'rxjs';
import { retryWhen, map, mergeMap } from 'rxjs/operators';
 
export function backoff(maxTries, ms) {
 return pipe(
   retryWhen((attempts) => {
       return range(1, maxTries)
       .pipe(
        //  zip(attempts, (i) => i),
         map((i: number) => i * i),
         mergeMap(i =>  timer(i * ms))
       )
   })
 );
}