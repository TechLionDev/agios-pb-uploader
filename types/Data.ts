import type { Icon } from './Icon';
import type { Story } from './Story';
import type { Fact } from './Fact';
import type { CopticDate } from './CopticDate';

export type Data = {
    created: Date,
    date: Date,
    copticDate: CopticDate,
    icons: Icon[],
    stories: Story[],
    facts: Fact[],
    id: String,
    liturgicalInformation: String,
    name: String,
}