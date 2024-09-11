import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    standalone: true
})
export class FilterPipe implements PipeTransform {
    transform(posts: any[], find: string): any[] {
        if (!posts || !find) {
            return posts;
        }

        const explore: string = find.toLowerCase();

        return posts.filter(obj =>
                Object.values(obj).some(val =>
                        Array.isArray(val)
                                ? val.some(v => typeof v === 'string' && v.toLowerCase().includes(explore))
                                :typeof val === 'string' && val.toLowerCase().includes(explore)
                )
        );
    }
}
