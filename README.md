# StairGunGame\_\_API_Node

# Sở dĩ cần check có bị rơi ở các sự kiện left, right dù ở stand đã có là để phòng trường hợp liên tục gửi left, right mà không đẩy vào stand dẫn đến di chuyển trên không trung!

Công thức xoay vector trong không gian 2D:
p1 = [0, 0]
p2 = [40, 40]
v = [p2[0] - p1[0], p2[1] - p1[1]]
newX = v[0] _ math.cos(angle) + v[1] _ math.sin(angle)
newY = -v[0] _ math.sin(angle) + v[1] _ math.cos(angle)

p2 = [newX, newY]

# Về góc bắn, không giới hạn. Tiềm lực con người vô hạn!

# gun phase:

-   first phase: 15s -> khi bắt đầu lượt.
-   gun phase: 20s -> khi sự kiện nhấn chọn gun force xảy ra.
-   computed phase: -> kết thúc khi kết toán xong.

# Equation oblique throwing motion:

-   x = v<sub>x</sub>t = (v<sub>0</sub>cos(α) x t)
-   To top: y = v<sub>0</sub>sin(α) x t - $\frac{1}{2}$ gt<sup>2</sup>
-   To bottom: y = $\frac{1}{2}$ gt<sup>2</sup>
-   To top trajectory: y = $\frac{-g}{2v\_{0}^{2}cos^2(α)} x^{2} + xtanα $
-   To bottom trajectory: y = $\frac{g}{2v\_{0}^{2}cos^2(α)} x^{2} $
-   According to direction Ox: y = $v_0 ✕ cos(α)$
-   According to direction Oy (to top): $v_y = v_0 ✕ sin(α) - gt$
-   According to direction Ox (to bottom): $v_x = -gt$
-   Contact between $v_x$ and $v_y$: $tan(α) = \frac{v_y}{v_x}$
-   The magnitude of the velocity at any location: $v = \sqrt[2]{v_{x}^{2} + v_{y}^{2}}$

# Formula oblique throwing:

-   The time when the obj reaches its maximum height: $t_{y_{max}} = \frac{v_{0}sin(α)}{g}$
-   The time that obj from maximum height until it touches the ground: $t_{after} = \sqrt[2]{\frac{2(H+b)}{g}}$
-   The time oblique throwing motion: $t = t_{y_{max}} + t_{after}$

# Equation gun (idea from equation oblique throwing motion):

-   $x = \frac{F}{m}v_{0}cos(curAlpha)t$
-   $y = \frac{F}{m}v_{0}sin(curAlpha)t - \frac{1}{2}gt^2$
-   With:
    -   F: Wind force, default 1 is normal. Then, F > 0 && F < 1, wind state is ← (right to left); F > 1 && F < 2, wind state is → (left to right). The value to display is F \* 10.
    -   m: Weight of object, default 1 is normal.
    -   $v_0$: The start velocity.
    -   curAlpha = 90 - alpha, to location 0 overlap 0h (12h) on clock.
    -   alpha: Angle relative to axis Oy.
