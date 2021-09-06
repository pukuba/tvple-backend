create table user (
    _id int not null auto_increment,
    id varchar(20) not null,
    username varchar(20) not null,
    phoneNumber varchar(14) not null,
    password binary(32) not null,
    primary key (_id, id, username, phoneNumber)
);