package com.biblesearch.backend;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class RefParser {

    public record RefRange(int bookOrder, int chapter, int verseStart, Integer verseEnd) {}

    private static final Map<String, Integer> BOOKS = new HashMap<>();

    static {
        BOOKS.put("genesis", 1);
        BOOKS.put("gen", 1);
        BOOKS.put("exodus", 2);
        BOOKS.put("exo", 2);
        BOOKS.put("ex", 2);
        BOOKS.put("leviticus", 3);
        BOOKS.put("lev", 3);
        BOOKS.put("numbers", 4);
        BOOKS.put("num", 4);
        BOOKS.put("deuteronomy", 5);
        BOOKS.put("deut", 5);
        BOOKS.put("joshua", 6);
        BOOKS.put("josh", 6);
        BOOKS.put("judges", 7);
        BOOKS.put("judg", 7);
        BOOKS.put("ruth", 8);
        BOOKS.put("1 samuel", 9);
        BOOKS.put("1samuel", 9);
        BOOKS.put("1 sam", 9);
        BOOKS.put("1sam", 9);
        BOOKS.put("2 samuel", 10);
        BOOKS.put("2samuel", 10);
        BOOKS.put("2 sam", 10);
        BOOKS.put("2sam", 10);
        BOOKS.put("1 kings", 11);
        BOOKS.put("1kings", 11);
        BOOKS.put("2 kings", 12);
        BOOKS.put("2kings", 12);
        BOOKS.put("1 chronicles", 13);
        BOOKS.put("1chronicles", 13);
        BOOKS.put("2 chronicles", 14);
        BOOKS.put("2chronicles", 14);
        BOOKS.put("ezra", 15);
        BOOKS.put("nehemiah", 16);
        BOOKS.put("neh", 16);
        BOOKS.put("esther", 17);
        BOOKS.put("job", 18);
        BOOKS.put("psalms", 19);
        BOOKS.put("psalm", 19);
        BOOKS.put("ps", 19);
        BOOKS.put("proverbs", 20);
        BOOKS.put("prov", 20);
        BOOKS.put("ecclesiastes", 21);
        BOOKS.put("ecc", 21);
        BOOKS.put("song of solomon", 22);
        BOOKS.put("song", 22);
        BOOKS.put("isaiah", 23);
        BOOKS.put("isa", 23);
        BOOKS.put("jeremiah", 24);
        BOOKS.put("jer", 24);
        BOOKS.put("lamentations", 25);
        BOOKS.put("lam", 25);
        BOOKS.put("ezekiel", 26);
        BOOKS.put("ezek", 26);
        BOOKS.put("daniel", 27);
        BOOKS.put("dan", 27);
        BOOKS.put("hosea", 28);
        BOOKS.put("joel", 29);
        BOOKS.put("amos", 30);
        BOOKS.put("obadiah", 31);
        BOOKS.put("jonah", 32);
        BOOKS.put("micah", 33);
        BOOKS.put("nahum", 34);
        BOOKS.put("habakkuk", 35);
        BOOKS.put("zephaniah", 36);
        BOOKS.put("haggai", 37);
        BOOKS.put("zechariah", 38);
        BOOKS.put("malachi", 39);
        BOOKS.put("matthew", 40);
        BOOKS.put("matt", 40);
        BOOKS.put("mt", 40);
        BOOKS.put("mark", 41);
        BOOKS.put("mk", 41);
        BOOKS.put("luke", 42);
        BOOKS.put("lk", 42);
        BOOKS.put("john", 43);
        BOOKS.put("jn", 43);
        BOOKS.put("acts", 44);
        BOOKS.put("romans", 45);
        BOOKS.put("rom", 45);
        BOOKS.put("1 corinthians", 46);
        BOOKS.put("1corinthians", 46);
        BOOKS.put("1 cor", 46);
        BOOKS.put("1cor", 46);
        BOOKS.put("2 corinthians", 47);
        BOOKS.put("2corinthians", 47);
        BOOKS.put("2 cor", 47);
        BOOKS.put("2cor", 47);
        BOOKS.put("galatians", 48);
        BOOKS.put("gal", 48);
        BOOKS.put("ephesians", 49);
        BOOKS.put("eph", 49);
        BOOKS.put("philippians", 50);
        BOOKS.put("phil", 50);
        BOOKS.put("colossians", 51);
        BOOKS.put("col", 51);
        BOOKS.put("1 thessalonians", 52);
        BOOKS.put("1thessalonians", 52);
        BOOKS.put("2 thessalonians", 53);
        BOOKS.put("2thessalonians", 53);
        BOOKS.put("1 timothy", 54);
        BOOKS.put("1timothy", 54);
        BOOKS.put("2 timothy", 55);
        BOOKS.put("2timothy", 55);
        BOOKS.put("titus", 56);
        BOOKS.put("philemon", 57);
        BOOKS.put("hebrews", 58);
        BOOKS.put("heb", 58);
        BOOKS.put("james", 59);
        BOOKS.put("jas", 59);
        BOOKS.put("1 peter", 60);
        BOOKS.put("1peter", 60);
        BOOKS.put("2 peter", 61);
        BOOKS.put("2peter", 61);
        BOOKS.put("1 john", 62);
        BOOKS.put("1john", 62);
        BOOKS.put("2 john", 63);
        BOOKS.put("2john", 63);
        BOOKS.put("3 john", 64);
        BOOKS.put("3john", 64);
        BOOKS.put("jude", 65);
        BOOKS.put("revelation", 66);
        BOOKS.put("rev", 66);
    }

    public RefRange parseRange(String input) {
        String s = input.trim().toLowerCase();
        s = s.replaceAll("\\s+", " ");
        s = s.replaceAll("([a-z])([0-9])", "$1 $2");

        int colonIndex = s.lastIndexOf(':');
        if (colonIndex == -1) {
            throw new IllegalArgumentException("Reference must include chapter and verse");
        }

        String left = s.substring(0, colonIndex).trim();
        String right = s.substring(colonIndex + 1).trim();

        String[] leftParts = left.split(" ");
        if (leftParts.length < 2) {
            throw new IllegalArgumentException("Bad reference format");
        }

        String bookTry1 = leftParts[0];
        String bookTry2 = leftParts.length >= 2 ? leftParts[0] + " " + leftParts[1] : null;
        String bookTry3 = leftParts.length >= 3 ? leftParts[0] + " " + leftParts[1] + " " + leftParts[2] : null;

        Integer bookOrder = null;
        int chapterIndex = 0;

        if (bookTry3 != null && BOOKS.containsKey(bookTry3)) {
            bookOrder = BOOKS.get(bookTry3);
            chapterIndex = 3;
        } else if (bookTry2 != null && BOOKS.containsKey(bookTry2)) {
            bookOrder = BOOKS.get(bookTry2);
            chapterIndex = 2;
        } else if (BOOKS.containsKey(bookTry1)) {
            bookOrder = BOOKS.get(bookTry1);
            chapterIndex = 1;
        }

        if (bookOrder == null || leftParts.length <= chapterIndex) {
            throw new IllegalArgumentException("Unknown book or missing chapter");
        }

        int chapter = Integer.parseInt(leftParts[chapterIndex]);

        if (right.contains("-")) {
            String[] verseParts = right.split("-");
            if (verseParts.length != 2) {
                throw new IllegalArgumentException("Bad verse range");
            }
            int verseStart = Integer.parseInt(verseParts[0].trim());
            int verseEnd = Integer.parseInt(verseParts[1].trim());
            return new RefRange(bookOrder, chapter, verseStart, verseEnd);
        }

        int verseStart = Integer.parseInt(right);
        return new RefRange(bookOrder, chapter, verseStart, null);
    }
}