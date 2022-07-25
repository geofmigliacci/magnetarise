import {
    Injectable,
} from "@magnetarise/core/src/decorators";
import { Cat } from "src/sh/interfaces";

@Injectable()
export class CatsService {
    private cats: Cat[] = [
        {
            name: "Cat 1",
            age: 1,
            breed: "Persian",
        },
        {
            name: "Cat 2",
            age: 2,
            breed: "Siamese",
        },
        {
            name: "Cat 3",
            age: 3,
            breed: "Ragdoll",
        },
        {
            name: "Cat 4",
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
        return new Promise((resolve) => {
            resolve(this.cats.filter((cat) => cat.name === name));
        });
    }
}
