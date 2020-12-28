window.onload = function() {
    drawMap('#map');
};

function drawMap(target) {
	// SVG 영역 생성
	var width = 500, height = 500;
	var svg = d3.select("#map")
	.append("svg")
	.attr({"width":width, "height":height});
	
	// 파일 읽기
	d3.json("../assets/ne_10m_admin_1_states_provinces/korea-topo.json", function(err, map) {
	// 그리기 위한 오브젝트 획득
	var geo = map.objects["korea-geo"];
	var map_o = topojson.object(map, geo);
	// 축척 지정
	var projection = d3.geo.mercator() // projection - 투영법, 메르카토르 투영법 사용
	.center([127, 35.5])
	.scale(3500)
	.translate([width / 2, height / 2]);
	// 패스 작성
	var path = d3.geo.path()
	.projection(projection);
	
	// SVG에 추가
	svg.append("path")
	.datum(map_o)
	.attr("d", path);
	
	// 색 설정
	svg.selectAll("path").attr("fill", "grey");
	
	// 경계선
	var mesh = topojson.mesh(
	map, geo,
	function(a, b) {
	return a !== b;
	});
	
	svg.append("path")
	.datum(mesh)
	.attr("d", path)
	.attr("class", "boundary");
	// 지역 이름 표시
	svg.selectAll(".place-label")
	.data(map_o.geometries)
	.enter()
	.append("text")
	.attr("class", function(d) {
	return "place-label";
	})
	.attr("transform", function(d) {
	console.log(d);
	return "translate(" + path.centroid(d) + ")";
	})
	.text(function(d) {
	var s = d.properties.name_local;
	if (!s) return;
	//if (s == "서울특별시") return s;
	//else return;
	return s;
	});
	});
}