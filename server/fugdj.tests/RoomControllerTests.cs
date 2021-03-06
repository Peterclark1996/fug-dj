using System;
using System.Collections.Generic;
using System.Linq;
using fugdj.Controllers;
using fugdj.Dtos.Db;
using fugdj.Dtos.Http;
using fugdj.Repositories;
using fugdj.Services;
using fugdj.tests.Helpers;
using Moq;
using Shouldly;
using Xunit;

namespace fugdj.tests
{
    public class RoomControllerTests
    {
        [Fact]
        public void WhenGettingAllRooms_RoomsAreReturned()
        {
            var firstExpectedRoom = new RoomNameHttpDto(Guid.NewGuid(), Common.UniqueString());
            var secondExpectedRoom = new RoomNameHttpDto(Guid.NewGuid(), Common.UniqueString());
        
            var roomRepo = new Mock<IRoomRepository>();
            roomRepo.Setup(r => r.GetAllRooms()).Returns(new List<RoomDbDto>
            {
                new(firstExpectedRoom.Id.ToString(), firstExpectedRoom.Name),
                new(secondExpectedRoom.Id.ToString(), secondExpectedRoom.Name)
            });
            var roomService = new RoomService(roomRepo.Object);
            var roomController = new RoomController(roomService);

            var result = roomController.GetAll().GetResponseObject<IEnumerable<RoomNameHttpDto>>().ToList();
            result.ShouldHaveCount(2);
            result.ShouldContainEquivalent(firstExpectedRoom);
            result.ShouldContainEquivalent(secondExpectedRoom);
        }

        [Fact]
        public void WhenGettingAllRooms_WhenNoneExist_EmptyListIsReturned()
        {
            var roomRepo = new Mock<IRoomRepository>();
            roomRepo.Setup(r => r.GetAllRooms()).Returns(new List<RoomDbDto>());
            var roomService = new RoomService(roomRepo.Object);
            var roomController = new RoomController(roomService);

            var result = roomController.GetAll().GetResponseObject<IEnumerable<RoomNameHttpDto>>();
            result.ShouldBeEmpty();
        }

        [Fact]
        public void WhenGettingExistingRoom_RoomIsReturned()
        {
            var expectedRoom = new RoomNameHttpDto(Guid.NewGuid(), Common.UniqueString());

            var roomRepo = new Mock<IRoomRepository>();
            roomRepo.Setup(r => r.GetRoomData(expectedRoom.Id)).Returns(new RoomDbDto(expectedRoom.Id.ToString(), expectedRoom.Name));
            var roomService = new RoomService(roomRepo.Object);
            var roomController = new RoomController(roomService);

            var result = roomController.Get(expectedRoom.Id.ToString()).GetResponseObject<RoomNameHttpDto>();
            result.Id.ShouldBe(expectedRoom.Id);
            result.Name.ShouldBe(expectedRoom.Name);
        }

        [Fact]
        public void WhenGettingNonExistingRoom_404IsReturned()
        {
            var nonExistingRoom = new RoomNameHttpDto(Guid.NewGuid(), Common.UniqueString());

            var roomRepo = new Mock<IRoomRepository>();
            roomRepo
                .Setup(r => r.GetRoomData(nonExistingRoom.Id))
                .Returns(value: null);
            var roomService = new RoomService(roomRepo.Object);
            var roomController = new RoomController(roomService);

            Should.Throw<ResourceNotFoundException>(
                () => roomController.Get(nonExistingRoom.Id.ToString())
            );
        }
    }
}