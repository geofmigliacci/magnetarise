import {
    Injectable,
} from "@magnetarise/core/src/decorators";
import { Cat } from "src/sh/interfaces";

@Injectable()
export class CatsService {
    private cats: Cat[] = [
        {
            name: "George",
            age: 1,
            breed: "Persian",
        },
        {
            name: "Super",
            age: 2,
            breed: "Siamese",
        },
        {
            name: "Batman",
            age: 3,
            breed: "Ragdoll",
        },
        {
            name: "Nice",
            age: 4,
            breed: "Maine",
        },
    ];

    /**
     * Returns all cats
     * @returns All Cats
     */
    findAll(): Cat[] {
        return this.cats;
    }

    /**
     * Returns all cats by a given name
     * @param name Name of the cat
     * @returns All cats with the given name
     */
    async findByName(name: string): Promise<Cat[]> {
        const normalizedName = name.toString().toLowerCase();
        return new Promise((resolve) => {
            resolve(this.cats.filter((cat) => normalizedName.indexOf(cat.name.toLowerCase()) !== -1));
        });
    }
}
