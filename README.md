# StairGunGame__API_Node

# Sở dĩ cần check có bị rơi ở các sự kiện left, right dù ở stand đã có là để phòng trường hợp liên tục gửi left, right mà không đẩy vào stand dẫn đến di chuyển trên không trung!


Công thức xoay vector trong không gian 2D:
p1 = [0, 0]
p2 = [40, 40]
v = [p2[0] - p1[0], p2[1] - p1[1]]
newX = v[0] * math.cos(angle) + v[1] * math.sin(angle)
newY = -v[0] * math.sin(angle) + v[1] * math.cos(angle)

p2 = [newX, newY]

# Về góc bắn, không giới hạn. Tiềm lực con người vô hạn!

# gun phase:
- first phase: 15s -> khi bắt đầu lượt.
- gun phase: 20s -> khi sự kiện nhấn chọn gun force xảy ra.
- computed phase: -> kết thúc khi kết toán xong.