package com.biblesearch.backend;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VerseRepository extends JpaRepository<Verse, Long> {

    @Query(value = """
        SELECT * FROM verses
        WHERE book_order = :bookOrder AND chapter = :chapter AND verse = :verse
        LIMIT 1
        """, nativeQuery = true)
    Optional<Verse> findExact(@Param("bookOrder") int bookOrder,
                              @Param("chapter") int chapter,
                              @Param("verse") int verse);

    @Query(value = """
        SELECT *
        FROM verses
        WHERE tsv @@ plainto_tsquery('english', :q)
        ORDER BY ts_rank(tsv, plainto_tsquery('english', :q)) DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Verse> search(@Param("q") String q, @Param("limit") int limit);

    @Query(value = """
        SELECT *
        FROM verses
        WHERE book_order = :bookOrder
          AND chapter = :chapter
        ORDER BY verse ASC
        """, nativeQuery = true)
    List<Verse> findChapter(@Param("bookOrder") int bookOrder,
                            @Param("chapter") int chapter);

    @Query(value = """
        SELECT *
        FROM verses
        WHERE book_order = :bookOrder
          AND chapter = :chapter
          AND verse BETWEEN :verseStart AND :verseEnd
        ORDER BY verse ASC
        """, nativeQuery = true)
    List<Verse> findRange(@Param("bookOrder") int bookOrder,
                          @Param("chapter") int chapter,
                          @Param("verseStart") int verseStart,
                          @Param("verseEnd") int verseEnd);

    @Query(value = """
        SELECT *
        FROM verses
        WHERE text ILIKE CONCAT('%', :q, '%')
        ORDER BY book_order ASC, chapter ASC, verse ASC
        LIMIT :limit
        """, nativeQuery = true)
    List<Verse> suggest(@Param("q") String q, @Param("limit") int limit);
}