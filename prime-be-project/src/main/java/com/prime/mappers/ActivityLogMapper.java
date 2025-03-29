package com.prime.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ActivityLogMapper extends CommonMapper {
    ActivityLogMapper MAPPER = Mappers.getMapper(ActivityLogMapper.class);

}
