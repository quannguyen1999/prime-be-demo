package com.prime.entities;

import com.prime.constants.ActivityAction;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "ActivityLog")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "char(36)")
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID id;

    private UUID userId;

    private UUID projectId;

    @Enumerated(EnumType.STRING)
    private ActivityAction action;

    private LocalTime timestamp;
    

}
