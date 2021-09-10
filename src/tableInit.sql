create table user (
    id varchar(20) not null,
    username varchar(20) not null,
    phoneNumber varchar(14) not null,
    password binary(128) not null,
    primary key (id, username, phoneNumber)
);