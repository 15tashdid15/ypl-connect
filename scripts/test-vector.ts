import {
    cosineSimilarity,
} from "@/lib/candidate-search/vector";


const a = [
    0.1,
    0.2,
    0.3,
];


const b = [
    0.1,
    0.2,
    0.3,
];


console.log(
    cosineSimilarity(a, b)
);