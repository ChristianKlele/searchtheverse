package com.biblesearch.backend;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class BibleImporter implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public BibleImporter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM verses", Integer.class);

        if (count != null && count > 0) {
            System.out.println("Verses already loaded. Skipping import.");
            return;
        }

        File baseDir = new File("../kjv-data");
        if (!baseDir.exists()) {
            System.out.println("Could not find kjv-data folder at ../kjv-data");
            return;
        }

        ObjectMapper mapper = new ObjectMapper();

        Map<String, Integer> bookOrderMap = new LinkedHashMap<>();
        String[] books = {
                "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
                "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
                "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
                "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
                "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
                "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
                "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah",
                "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke",
                "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
                "Galatians", "Ephesians", "Philippians", "Colossians",
                "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy",
                "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
                "1 John", "2 John", "3 John", "Jude", "Revelation"
        };

        for (int i = 0; i < books.length; i++) {
            bookOrderMap.put(books[i], i + 1);
        }

        int inserted = 0;

        for (String book : books) {
            File jsonFile = findJsonFile(baseDir, book);
            if (jsonFile == null) {
                System.out.println("Could not find file for book: " + book);
                continue;
            }

            JsonNode root = mapper.readTree(jsonFile);
            String testament = bookOrderMap.get(book) <= 39 ? "OT" : "NT";

            JsonNode chaptersNode = root.get("chapters");
            if (chaptersNode == null || !chaptersNode.isArray()) {
                System.out.println("Could not parse chapters for: " + book);
                continue;
            }

            for (JsonNode chapterNode : chaptersNode) {
                JsonNode chapterNumberNode = chapterNode.get("chapter");
                JsonNode versesNode = chapterNode.get("verses");

                if (chapterNumberNode == null || versesNode == null || !versesNode.isArray()) {
                    continue;
                }

                int chapterNumber = chapterNumberNode.asInt();

                for (JsonNode verseNode : versesNode) {
                    JsonNode verseNumberNode = verseNode.get("verse");
                    JsonNode textNode = verseNode.get("text");

                    if (verseNumberNode == null || textNode == null) {
                        continue;
                    }

                    int verseNumber = verseNumberNode.asInt();
                    String text = textNode.asText();

                    jdbcTemplate.update(
                            "INSERT INTO verses (translation, testament, book, book_order, chapter, verse, text) VALUES (?, ?, ?, ?, ?, ?, ?)",
                            "KJV",
                            testament,
                            book,
                            bookOrderMap.get(book),
                            chapterNumber,
                            verseNumber,
                            text
                    );

                    inserted++;
                }
            }

            System.out.println("Loaded " + book);
        }

        System.out.println("Import complete. Inserted verses: " + inserted);
    }

    private File findJsonFile(File dir, String book) {
        File[] files = dir.listFiles();
        if (files == null) {
            return null;
        }

        String target = normalize(book);

        for (File file : files) {
            if (file.isFile() && file.getName().toLowerCase().endsWith(".json")) {
                String fileName = file.getName().substring(0, file.getName().length() - 5);
                if (normalize(fileName).equals(target)) {
                    return file;
                }
            }
        }

        for (File file : files) {
            if (file.isDirectory()) {
                File found = findJsonFile(file, book);
                if (found != null) {
                    return found;
                }
            }
        }

        return null;
    }

    private String normalize(String s) {
        return s.toLowerCase().replaceAll("[^a-z0-9]", "");
    }
}