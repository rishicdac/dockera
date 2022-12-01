package docker.dockera;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("test")
public class TestController
{
	@GetMapping(value="/test1")
	public String testhandler()
	{
		return "test success";
	}

}
