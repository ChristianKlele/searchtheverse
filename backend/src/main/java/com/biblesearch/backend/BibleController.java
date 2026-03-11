package com.biblesearch.backend;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class BibleController {

    private final VerseRepository repo;
    private final RefParser parser;

    public BibleController(VerseRepository repo, RefParser parser) {
        this.repo = repo;
        this.parser = parser;
    }

    @GetMapping("/lookup")
    public Verse lookup(@RequestParam String ref) {
        RefParser.RefRange parsed;
        try {
            parsed = parser.parseRange(ref);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reference");
        }

        if (parsed.verseEnd() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use /passage for ranges");
        }

        return repo.findExact(parsed.bookOrder(), parsed.chapter(), parsed.verseStart())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Verse not found"));
    }

    @GetMapping("/passage")
    public List<Verse> passage(@RequestParam String ref) {
        RefParser.RefRange parsed;
        try {
            parsed = parser.parseRange(ref);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reference");
        }

        if (parsed.verseEnd() == null) {
            Verse single = repo.findExact(parsed.bookOrder(), parsed.chapter(), parsed.verseStart())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Verse not found"));
            return List.of(single);
        }

        return repo.findRange(
                parsed.bookOrder(),
                parsed.chapter(),
                parsed.verseStart(),
                parsed.verseEnd()
        );
    }

    @GetMapping("/chapter")
    public List<Verse> chapter(@RequestParam int bookOrder,
                               @RequestParam int chapter) {
        return repo.findChapter(bookOrder, chapter);
    }

    @GetMapping("/search")
    public List<Verse> search(@RequestParam String q,
                              @RequestParam(defaultValue = "20") int limit) {
        limit = Math.max(1, Math.min(limit, 100));
        return repo.search(q, limit);
    }

    @GetMapping("/suggest")
    public List<Verse> suggest(@RequestParam String q,
                               @RequestParam(defaultValue = "5") int limit) {
        if (q == null || q.trim().isEmpty()) {
            return List.of();
        }

        limit = Math.max(1, Math.min(limit, 10));
        return repo.suggest(q.trim(), limit);
    }
}