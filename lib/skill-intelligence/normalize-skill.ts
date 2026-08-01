import {
    skillAliases,
} from "./skill-aliases";



export function normalizeSkill(
    skill: string,
): string {


    const input =
        skill
            .trim()
            .toLowerCase();



    for (
        const [
            standard,
            aliases
        ]
        of Object.entries(skillAliases)
    ) {


        if (
            aliases.some(
                alias =>
                    input.includes(
                        alias,
                    ),
            )
        ) {

            return standard;

        }

    }



    return input;

}