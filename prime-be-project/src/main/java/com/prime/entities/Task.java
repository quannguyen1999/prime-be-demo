package com.prime.entities;

import com.prime.constants.TaskStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "Task")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Task extends CommonBaseEntities {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "char(36)")
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @Column(columnDefinition = "char(36)")
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID assignedTo;

}
