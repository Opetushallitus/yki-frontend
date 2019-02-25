package fi.oph.yki;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class YkiController {

    @GetMapping(value = {"/",
            "/ilmoittautuminen",
            "/tutkintopaivat",
            "/jarjestajarekisteri",
            "/tutkintotilaisuudet",
            "/maksu",
            "/ilmoittautuminen/**",
            "/tutkintopaivat/**",
            "/jarjestajarekisteri/**",
            "/tutkintotilaisuudet/**",
            "/maksu/**"})
    public String index() {
        return "/index.html";
    }

    @GetMapping(value = {"/status"})
    public ResponseEntity<String> status() {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }
}