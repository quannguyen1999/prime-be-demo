package com.prime.mappers;

import org.mapstruct.Named;
import org.springframework.util.ObjectUtils;

import java.util.UUID;

public interface CommonMapper {
    //Name Convert Types
    String CONVERT_TO_STRING = "convertToString";
    String CONVERT_TO_UUID = "convertToUUID";
    String CONVERT_TO_BOOLEAN = "convertToBoolean";
    String CONVERT_TO_DOUBLE = "convertToDouble";

    @Named(CONVERT_TO_STRING)
    default String convertToString(Object fieldValue) {
        return !ObjectUtils.isEmpty(fieldValue) ? fieldValue.toString() : null;
    }

    @Named(CONVERT_TO_UUID)
    default UUID convertToUUID(Object fieldValue) {
        return !ObjectUtils.isEmpty(fieldValue) ? UUID.fromString(fieldValue.toString()) : null;
    }

    @Named(CONVERT_TO_BOOLEAN)
    default Boolean convertToBoolean(Object fieldValue) {
        return !ObjectUtils.isEmpty(fieldValue) ? Boolean.valueOf(fieldValue.toString()) : null;
    }

    @Named(CONVERT_TO_DOUBLE)
    default Double convertToDouble(Object fieldValue) {
        return !ObjectUtils.isEmpty(fieldValue) ? Double.valueOf(fieldValue.toString()) : null;
    }
}
