import { prisma } from "../db/prisma.js";

export function stringProcessing( string: string ) {
    const output_string = string.normalize().trim().replace(/\s+/g, ' ')
    return output_string.length <1
        ? null
        : output_string
}

export function stringToTitleCase( string: string ) {
    const cleaned_string = stringProcessing(string)
    if (cleaned_string === null ) return null

    const string_parts = cleaned_string.split(" ")
    let output: string[] = []
    for (var part of string_parts) {
        const part_lower = part.toLowerCase()
        const part_output = part_lower.charAt(0).toUpperCase() + part_lower.slice(1)
        output.push(part_output)
    }
    const output_string = output.join(" ")
    return output_string
}
