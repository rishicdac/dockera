/**
Generate PDF Templates for Certificates
**/
function generateCertificateTemplates(data,certificateTypeId)
{
	console.log(data)
	
	var imgData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8IAEQgA0gEsAwEiAAIRAQMRAf/EAB0AAQACAgMBAQAAAAAAAAAAAAAHCAUGAQQJAwL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAG1IAAAAAADgcgAAOOQAAAAAAAAAAAAfM/fSimLyWI+03om5yzElmjJfD6/IgjH79C5tkj1q2stdzUi0JlgAAAAAAAAAAcQXkYxNM+/wtCRrt2jRMbjpuOuYVu13dIyNyk2uO4lnILwlrypW8YzSC1sgQtLR3wAAAAAAAANY2frkF16k3Ak46vN3n4fHE7ThDaL2djIFUKt+pMUFUtOs5gzVdi+1eD0rppdiBjTZyq1askMAAAAAAAADRN700qXuOb0MtdQS9tCje8zoseno1vMJTaPx0aeErVXyUfkvaXmNIPSCMpfrIaxKGhT+SNzxyAAAAAAAAOt2eCs8UyrGZNepR5YUqHhpxwB173+cNzSFa02A1kxGn7duJpki9KwZs9TNm10+tqa225O4AAAAAAAAAD81Qtj1SnP3yejmxZPVJWIa+M9S+U86F58cUvzdpqrG1690vqZL682ZP1n/wA/oAAAAAAAAGPMgrHMRvXGEhUmeNtL/BrWSknDETzxJGZPxGUo8FVcBbyDDQd16+PJ52GtOZLCtai0ndqe2AAAAAAAD8fsQDXX0I/J5h2ykuuZcPs+b81k2xBPG3kMzLHUKlsPhE8am3a1OuZNc3SvVfi41YcLYYp9Plru0YbNAAAAAAAAAA45GJgixo87s1faNSO4yx8eG4ffXO+b1FluJmKo2A3UAAAAAAAAAACOyRFZBZtWQWb/ABWOupcuvcJy0avO3Y/Z9oAnngi2xVd4fPUf6+a1hy0Ssgs2rILNtI3cAAAAAAAVrspWsrjZ2m8zEZTPmsqVotbTS6JTiYoSmc0DWO5IJJEZ5eeikk8wtL5+oOl6Iha+sslmJ6cv6QTtO8ETuAAAAcOQAAr3YTg86c/fceaO9X0HmjvN9RRbo33HmvIF6B5qbrfYUJ5vqKPfC9A85JBu0KLav6IiFZr45AAAAOOQAAAAAAAAAAAAAAAAAA//xAAsEAACAgICAQIFAwUBAAAAAAAFBgMEAgcAAUAWFxESExQVISQ2ECUxNWAz/9oACAEBAAEFAv8AmbdyOpTGu3TMtIrlZiVFza8kQ9Va77FZ5NllhF7q/ZWl3YsxB1AsxC5swa70SjH8fJzz6iwZTsTCkoZvH0KAjYU8Ct9LxTlXU5gdcr/s63x59bD53ZfKnqtZAiWYAbDjUZU0ZaE7AWDV8vs+qVp3Z/HC7HiJma9zLW7KNFKpDodqPurcZdkil7l1zNXoaROyXvwOVn8QRLSRwimYjl0vbbp3M2FbxYhhbX2IaGqbGKcWvoa6eupzX6so+KybGiWT2ygVSxD6nFl81taEDqr28QWouhwheggMC7JYutD2QaaGBl0QvGhsU13AcGJ5TB3CNJeai3JJCPahLSPTVq/8bT0RusgfWw2jbxvVPDZDnS6HktAtqjKpKypmEDEnZpbabMhlJZHRXyJcnIYIa9XJD7CMGxjKzmtVF0Pxj/uIcXJZhIOaTcq96kas6hAsOgv1CrPjVyS0zot2GexZsv4c8MdiJq1vZB3BrlTWgAe3JfFORTswzYfsUhetfjTNSpXrYcs1YbkJbVoIlixKFdPTdf4r/wCae2TFnHVLOdK1Rs/e0mVwFyssI0uxTKKZSU63hugWyeA1Hw4uYAay0ogwpyswiZqw3OzdrC/Sy0XXhnaeZ/Oif6d5dY9PTMPIjqt2lS7FZDvSn1QvFrLrtfLTKLreHtHeuO9cSsJq94bSywKo621rT1AsIE7NSVbYiwMaB2Ypgx/epHNRWepVHlwhXHwuW07Jfql19qncj/YpVWtncs1YcBow5ruubyWKojqBddxJ+14c8MdmJi05DY7tyGQIhWmGIUG4VbLPtXIRUyBAVOOI61P5AmbrjjbivEuMP9vDDaXZEg4zwx3dSK+V8mcNC6/Y+8Q10TB6lLE8ltUHrFfxG2k5jihA+z37YvGd52DO/wBGZob9dUwHK0A5lpTgvtbg5rg9K0Rs9qqCUIvvb1eEyXhpjUnJTTKTNfNMwrXlTb1buSySerNw/UZXhls1MJMK3id/p0Q28UitiG21TYqQ+Bk2kWezFVz2MlBQ+EsNuSkFpZU56qrZqYkBkkVEUJlj4rqgm+wvzlcVimzYbRCm5NVYlWr7jiqQgymBoT40uEfXRTdE/wBUMTZCJp0r2rTFtetEaWdNzyTLVsANv9wVoqsOIWhhOyzZUlvUAju0bcY4LuxnY4dlsjdx418BudItQ666x68bv9eYARkUz+3XVeOAQ6uWBQCAUhiO3Fh/UzWxVeYZd5R3mcxEUcn05ShTaAgsNsLDYl4I2wLp8jMrB7PIII6sPh37eNClHu6v3OEdRDBwmapBoiG3IZJeqb4yd5HnNX7F7HCslYdpwVFmMD0g8P8AW5RrkITepA0sUD6KTxWGbm0S9jnlY4N25BjNEyDJ6JLcAanIuMlVnH+B3j83GDUI4lmdQDS93hey7uKOxV3CCvZitxcYUASxczCtSD2t7PGGe+suu+uTTx14z21a0UsKUxOOQNPFLuPx4bfAoLjdsz1DCLDEDMgTS883BImsEo+F8Pjw4hhj3RzTpCp3BdNKFwJuibDgVsFn8eMqEKZcerLJrPIhs0TVAwAmHYsgJXGrkN4jVGRHdxD6fDL8cYsguszhngLUgkbytUhpxeOQF1CkRvTVG1w0jmlzIDs4yF571D/sibMzvccmsWKOuFezahMZ3ETu416JlstA9LyydBU8SA68zv8AXh7X4c/xt1vmtRiGIiCkMOpk70qpVhrzBaoDiuRQ4Q4ebnn1Hgd2eFDcN7bMEuD1421TAtL449nNM1JsS6cbWswe1DQngHaQcxyOTGXDxnJwjT6vvfW5731ue99bnvfW5nu+D5DbOSYZYvk+oEYVoNzHdlSPH3wrc98K3O93VcujjQtnO5vp/UCM5Jflh3fF1F74Vue+FbnvfW5731uKbNg1jPA3d/qQzBnQzZUQIenKh7i9eXrsdxQxMzY3GCpQoIdqzlbn1rYwIGjpPO9a5r9YHU4ntUzVjHNYSxljWxbuIlg51/kgqYr6vXavksPOVLJh05/FvA3d/qYf/bZluai9iHcY41LajmpJvDvX5HUvNUQZZM93LrO4lLsRGdkNimEtXsjtlrF+jMNuaf8A5ftb+bddfHhAZYFS4mWDXlijsEOzS7JTayra05/FvA3EPtEBg8UVoZnJDrDL6aMcr22iEF6aL8BXm1djm+tZzvWGS1ThXS0cuZBgkFZrZfLNenYVjI7MeYswU55ckvl2IpNWIHqkpEUeK3iB1kJxwSXaGZiqyHrep6Viitf8r//EABQRAQAAAAAAAAAAAAAAAAAAAID/2gAIAQMBAT8BBX//xAAUEQEAAAAAAAAAAAAAAAAAAACA/9oACAECAQE/AQV//8QATBAAAQMCAwMGCQoEAgkFAAAAAgEDBAARBRIhEzFBFCJRYYGRBhAjMkBCQ3HRFTM1UlNik6GxwSRyc+GCkhYgJTRgY5Si0kVUdLLw/9oACAEBAAY/Av8Ahl6Sa3baBXCy9CJWKTIDRsSYwHYC52uW6LWMzp75SCjnmDP0qm7vqQ5iinNlK55Jlhu1k99ObTB3YURE5rzi716PEZAOckS6CnGtlieDy4SZrZ99SIDjwvYe8SpGJBtl6KxGCrxFCuabJU0HKlk91ScIZQ9qyi+U9UlTenpRGS2EUuq1ib+DykPINjXctuP5VisOU8jbYobTKl0mi6J06rUlxvD/ACchbucXQG2/LQ4S7h2IA5IWwv7bMgn05Usn61/B4yLEe98w5kLuppt+RtXERBV07Ipr4smdM/1b60AYdiPJUTzmlS2fto8Y8I3jkZLWZiKubN79Kek4DCmSX5HM2UnnZkv0puqQ9ibXIlfE1bzroaqu5F41KdbIkZVSFwOGQdEp1liS086154AV1H0iTg+JR+SOq4rTeui9S9dYrEeZV+K62QC2W40XzVqNGbxWUziJlo4Da5EJeCVyh7GZBLf2SZVXtvRMgXLZaezZ3IvWtJJnzvkSCXOBiOPl3U+78VtWwjKsNkE2jsyWu1cAOJXXd2VjDkJ53k8Q2NntSuR3Jcyl76axJheXYc9zSB752OX1c6a+6kLBMUdNwE52GTueq/yLx/JaSPirSwZG7P6n9qEIE35PQi2m0jbnPfbfQv434SO8kzaIgkqqvVrWKrhktZbk1qzD6p5RteKFf376fx/Ey2ayvm09ZR6vfT0lIxRxBzImb1vRggSYTitEiFyhC4L1U34S4dMa56onNX5xekevSttjGGP4zPdtqBq0jfQAolMTI2FDBdIc/lecYdq1yTDsZaYavZ4mgInF6k4W7ajYk+89OcfRVZjuNIP+MkvupmVJSc5I2g3eMwVE/wAOX8qVhzQTsu1Z5pLWNwY8Z95G+Tk66TvzlyW1vdRwnohjBm2aeu9fL0Fu4U9HdhyhdZK2ZuSnf5tOHyaSGJR2b6OjmkIm/hvRKJt2VMWFwjm2hW9y3oc4hMhPjdP/ANwrkj2Ey89r5gcLL70uutQMEZmCcWMPk3TTKuTrTpRNKi4amZ90B+ab87rIqZkAhCLooSIW/wBEfnkwchGrcwKVlC5PiAJzEc89tf3SihmI4qsIiRhvNdsTXetqdk4rDYjKZ5mkRnIfWqpQ4VGOz8hLuKnqh/es8r/cowq+/wBYpw7d1OynNFNdBTcI8EpjmXjMLtHS4dSVsg1JVzGdrZyXetY5sH3DOSTLpNmOg89dy+LB8U9qYLGeXpINy/5VSo5w0MpQmito2l1VaLFW4+yYfs5yYEVSaXLc+xNa+SHzvHf1a+6f96NHYjUwhRVAHkumbhRsu4A1hGIsGhsvRxyqJJ09KV/pHj0htyOd3UQj85b7y+FHh0JXDIBvtMvMW3ohNuihtkliEty0mK4DfI15RWb84LdHSlR348dqXj8pTN54tcnPXf8ACosl9rYuuNoRB0VPkruVzIPuTRP0ozTRybL2d0T1AS6p3qndUOS61tGRNFMVDNca/h2QZBdbAOXxE0+0LzZbwNLpXk2FhHfzmPhUsOfiLbjwrcrCrXWlNyYqTm3WGlNxXsuyHTW61PchPEkeC+AoSLo6Jpb9Upl9tVE2jQxVOCpTD6bnAQ++ncDxjDRKKlgSSW8bomvVvo8Cw65YZFkHz83MFFXivGlRnysg/nHy3r6I7GiPkxIuhjZbZrcFqXhmIo49dsm0R7Q21Xii8aw/EsUb5TiEkdoAWzWTqTdSTYarsyuliTVFp5XcQeQlJd0bj/mrCxPEZCM7R1RUYu8tL+t7qDlGJYi9secAKGUF6rXWuVbU3hUyRDNrZ6eO66JWL4Zzz5MAGbjSovrJpRKyc0SJFFcpCmi1jXk5Wzzs5ueO+62tpSfw038Yf/GsPVBJsdiNhNbqiWrkLrwLP1AHR5pX9/GsYwtpvlMrb2BwtBS3GnMWxKQfIiDI22SWQ/cnV0+iDMkNOvNq4jdmt6aL8KfjvxtjNRouTnJsPOtpqi1HxTEZ6N4eI2RL85BFbW6t1bHBiFYrC7Ow9NT4x7wdXf0LqlECfOQpedUT6pja/eKd/ibbzIqtOGlk4a38Tjsh4GWwTMSku5Kdh4cnJoRIoEa+e4nHsrEX8vOkSG46KvQlyX9vE/dFzTpIoN+gOPetNMNopOOEgCicVWmmzJEbYaRCJehEr5V8GZbRApKRN59ELqXhUrG/Cd1t+Rt8oiRXzKP3U30sLD1PMAZrK3lS3ohNugLjZbxJLotE9hL/ACc9+wd1HsXhReCjkckfkPI4Cgt8wr6qdtqiYNKf/wBqyyQnBHXKq7qDGmBvZEB9E/JaJmV/ucsFYe+6i+t2LrTkNwfKiVupeum2DdtFk+SNL82/BfF4Vk2e2bbYZC6L5pISX8WD4Z7QQWU6nQR7v+1EqNFHe84gd9NYZELaRMPDYif1y3kXfXyq8No8b5u/rH/avk2bMBh6WCgIr16ViuGG0ThSG1BnLuU/VJO+kKcSYezv5/OPurZxGuevnPF55eiyJWGy3pMMluINWVQToy1CWThznLop7RpxI5CfWnuoXjAkHaI44i+oI8P2p3weejZ2iXY7ZV5qkqbrflRyUcmckLVCbaQ0b6l1/Oo8M8WQMUaXJHeebUcwfUJf0o2zxGM0+2Wu0ziqL/lpJJz4Zy2w2ZErvM2ttLrXhG67ieGm7LBMyjJTKnP39VJIlYjAODG8q/s3c2nR20/IkYrGA3Sv5MDL3InNolexEjxJ0E2asMXWOi8VQvWoiEJzsFPOkuKLaX92t6hQkYLKqcxprgnStYXi7JXZeDKK23cU/X8qj4j8npKSK3kY2iLa/E9KFIYHHBV84WUQE7VpoXj2jyCiGScV9FvRgzhANIK2s/mUv2o8VYwJ1lp8LSm2hVUL7yaaUsiD5WChjJI7aJzUXX/FT0aSf8Gj2xOJlRRVu/7pQTGZKwHHi5rGXMK+7oppMZw96ZFt5LEo3ONE/m9ZOpaNIhhjOHSB2b8dvR3L05F9ZKxWOw05IalxhWM7ktmTaDv6FTjTeGRFRiAK5pM59dmD59XSicKQcCgPYjMX/wBQdbytt9YX/VaOJi+IrLxC+ZWW/NJeKKfFaZwrCNlEYZbRVQG+nhXg/iclvZq8wgOonqlvqLhjMd17CoyptZDYXz5U3CvD302y1gLYMtplEUf3J/lqNNbbJoHhzZC3p6OpkI6aqtqdbgQW0bTQHHFW/vtQzMKibB51fKbBvI05/NwqC/iOHfJbjiiMh5Fu2WvnX91Rp8IxkjGc1JsrpkX+9qebcVSbbeVAReCUKvwY7pDuUm0ulC00CNtjuFKJ9IbG1LeeRL1iTjK7MwjmoqnDSnsRcXK1FHzl4ktI60i4myWzImo3O3JbL+X500GJ4YUfDhsSRBLmF/MSUjD2DthHRLILBbuymJbDTZNPDnHmVZEsnpG1HDogu3vnRgb1HZw+EjhvIvlbXQeykWVIcixCX2i7P/tTWlZ+XH2ppAouCzZzadShQ4VhGHtTxU81yFRJfet7JQbXwVcVCW3kpIn+lCqjlVU81eFPxIvg4/JAPNeV1AEu3dTsKZgrUNqS0oeUPaaLpvTSvk+Tj7raKqlyRPIpmXjf1qUsKf5TDFc3kRTN2pXyZiUJFctfagFrfzJRbTC4ZKW9dgN++gaaAW2gSwgKWRE9EfkndQZBTW3VS58NdRngqOJekSLLHar7FzmnW0mym448M676WPg0B7EHuCqlk7t9bR19MHa3iCLl/v31/tHDxxOKntBS+nvT90pyK4+WHPOioWc039BUTkuS/NuuiXypSNQ4zccPuDv/ANRWZLIPtL6rg3px6O85hyprfNcE76YwuI89jclu6Zh3Kq9dE4xFbwRhxLK7bKSpw186tqzJ+WG95ARZ/wBde6kj4zCdw59NCK1x7t9LMCcysZN7mbRKyRxem9JAmVPzpJcRStfKQFvFfQbLrRPQXFgOrrktcP7Urhx9swntmNU+KUD0tFm5d4PGutBHWMODn0Zbgq/zJ+9I4y4Lra7iBbp4iN1jYSF9uzovb01tMOkfKmHDvaXW3+H4ULEpfk+ZuyO+aq9S/GrpqniJx00bAdVIlsiVyXBWSxOWulxRcifGhfx+eUSPvSMHw3JSckiijn2p6mvb4lF+Yhu/ZM88qKM1hzIM/XeHOfZ0VsoUdx9fu7qE8UlIwn2TPOXvpuJEb2bIbk9EJX4gtvL7ZnmlRHhrozW/qEuU/hSiJSIDvEC0ReyhDFYouD9qxovdScjlgZr7JdD7vEpOtbCT/wC4a0Lt6aEX0+U8HvZC35f/ABpvEGj25u6BHTz83X0U3JxV3kGFrqLIaXTqT91pAhRxArWV1dTL3rW1lSG47f1nCtRBhzRTXfrlzQrZnIVpsvYxkyp8aQ1Y5I0vtJC2v2b6E5eae99/QO6kaYaBltNwgNk9I2UuM3IDoMb0p4dIOIf2Z84PjSm9GNWh9uzzh/tQgTvLmE9SRqvfWfkT/Kvsrpl76NqJDcCGvqRxWy+8uNbXkN/ui4Kl3UsRxds20uUo8jXL1IvCskFkII8S84qzAEie7xNbrbtoTxWVsU4ssal31/CQwE/tD5xd/pxE7H2D667ZjmrRPBiEd1r6jhZHO7jWaFLcZ45UXmr2Uoypp7NfZt80e5K8nKjsCi65z5/YNIchCxB7pd83uoQbFAAdEEU3enKRKgiiXVV4UoA7y576sfVO+iCLkgNf8vU++toyw9KzLq84unetIeLSs3/KjfGs+FPlHc+zeXMPxraPRzEB3Psrce9KQHjGez0P+d2LSA6awH/qveb30hgSGK6oSbl9HYecjFJ2p5LCVrV9FO/ip8K+infxU+FfRTv4qfCvop38VPhRZMLcQ7aXdT4URzJJmKrfZotgTspNpmyccu+kNcDfmPJ68h5F/K1qQRwlwUTgjqfCvot38VPhX0U7+Knwqy4U6qf1U+FKZYG9FfX2kd5B/K1qXZZsnDPvpChSjbT7NdRXsoNrhZq5bnKLml6+i3fxU+FfRTv4qfCvop38VPhX0U7+KnwpZjbBR0zqGUlv6Dhv9Zf0phookSUwhai8yiqvbvpyJh5swMWZFC2Y6IqdafvSsTGdk6K3S+4vd01jU9+BCdkxlTZlycUteik7OPnJLWVgcvdahxVnDYgyyabXNsUWyraidNBQi4AKCnclNYfKiRpEfZl57KZunfTrexYZbBwsostIPijy8cQNrPXZRGHePXRAOsN3nMl1dHZ4hw+ZEjPsIySpmZG+nXUnD4cOIxHRtE0YG+o9Pb44snBcPbxOU4iE6+4O1VEt6qUgYphcOSxfnBydGiTup1cORsYittqCN7vNSi/rl6Dhv9Zf0oP5kp19hwmnQBtRMV1Tm0mF+ErQC6ugS9yX/Za8Im9sL8d7KTRcbdfibJnnWjtl3Wv4tvuaYZMzNdyJT5Ct0U1VF7acxDEF2WFQvKOkvrr9SlmLPnMiNkZbGMNm0To59OwUeI5jAJz3RQCz8C46U7FfHI80WUkpP6B1M/lb/wDqniBuSGzcIEPJfVEXppuMMjMyQC4IFzmyRddKbi49hDW0cVA5QCcd3vSoxxHCWPJzWbNbqFrfGi/rl6DAGLGdkkLyqqMgpW06qQ/9H35BoqEKux3dO6iemeD7hSFHLthiuiqftX0VN/6c/hUjCSw2a9EdSyIcc7h7tK+ipv8A05/ClaiwZqx13suxSIf0raO+BBK50g28KdyUcNnB34MM/OZjQyHN71tdaEiwaY4ieoUc7LQ4Yvg6XIUW+xSI6mvv30qphEwb8EjnpSuQsDeR8hyk6cVxVVP0pXJng+4T9su2GI4JJW1heD7gP5ciulFdVVSttL8GxkO7s54eV6FxnwXbbMdUJMOLSnpcjDZxvOlmJeTF8KbYk+D5PRGxQUZchmvC3nb6R2F4HFHkj5rpNPOZV6bFSyZsGe87/wDGKye7SibksOR3Nsq5XQUV/wCFv//EACkQAQACAgEEAQQCAwEBAAAAAAEAESExQVFhcYGREEChscHwIFDh0fH/2gAIAQEAAT8h/wBoy/8AM+8UO0sePMspa+JjkxRUQuviWALD3gF/SYPqldZsYr5cTKn340IX6+ioXUqXWC5zujpU/BfqEE+S+QvC2XvNzbUJGSDufm4gWpcOAvH/ALKXVl/cnSYRwEx14FiErWy7QXLslwUZ2OdxRqVrqvRM7dTOvUJArUK7kUzYH2uRhfcv5aMCK1b9F6wWWinqFCO4wuMcn6hbdrI9oaqvWkmXA9SwFXMrBtvvKWMe8N0a3Fx/lxxCdmvmIOOifIPt1oZzEejiu6vhmDztTFt1AsfLMQi5dQaWF0Xdw6FBVM8w2dJwNi4fgZ6t7Qk9DykWzXcHmKFKWgUpgXQJlq4Y6AvZvz+PBQS/JchRKvUcZd5KxiXxMpAGUf8AGFqfXpd+/Pt8xBuEZmOoU9yrokqT4yWdzBazcegCrsgvRKfaBM3lAcrz4BhMfbVg2N9ev2z7Cwa6hTNZ+IexZGrcIcNjt2iTR4lowlz1V2swwGk2zIspDqAuJBaHsIVEzVHhju+h3HhRMlpmyKI2GCpoautmdOITQaEtwSgy0fqZO2DGXtLN+Y/QYAyaDwdxJCHdUOJ4lp1YyTjS760k8VKbzXcnUTK8ZIJRYWHJs0v4l7TC+Orl4jdb5hj8BbZyOLbYDUq6Al5+0LAGVS2hvgzuXADXV1hTxZ/hlpqHK5XS17dZVjB4+wY7czMA9s9H8jxcaE7arufVV7SmWg1lg+wURcuO0aVmzqvExESr1lKHLHetwAe8ysMMYpnk4s+TJ/8AItcAvGgG4fEaIZlAUIeBL9GIvmTwPzBRTdSjy1LoH3n3gmb+3LeDEAFWugEh+jSKltT/AM+0Y74iweGPG3qZuS/qbgjJ5EGmxm0CFgNbzSPpbMGv46K7GTMooe64BRPgCNOHHMJlU0dvX00BKFPTOdzX1ftZE/mqcJbT2GZsMjcoOjpEgXHLCx0t31m8qySLGCGocPZcYdjosd4jkPEVPFy2JvSAoF8y5Y5R9J0O32hDkzXXK6P7CWv4pTmqtjN5vtM65Zbdh0uMvOopVqiLYke+2l+2YWK5gcmQpWIaCb4VmyuzPepREbOSHVCjWr7fVggGVdEumY/FoV7llxc2RZAiaeFmDoMux8Oc3udY9eecRWR6xabxHV2Ampwa+Lcqk6x5FDNviWM5AOvYhinlD7OtSIRRS20x/Ihydw5fQ6ysOIzv+YTZHBLS42+Vja87vdwD0TKVaWexJXObMZrJHQD9BZf3dei/n6VAhnOC4ygEooKHZdszUjohVD2fQ7XGaFao66ZuMrkig/MxPApDKX4iMegwDd95wwNhWPYW9z6mLgaonFHjEPszCpRwO4w8CdQ/k/L1MGvccU9Sx4U9ZeIA9OGV0HEo1gZmv7nxNmESXwfhek1PleHgPRMy9EK27/Ni+8UJ3Y0oAD2Nwyw2mOps4foy7kJoXVqgaaA8j8pp6l/K8hj+q/NTKYp9p1qo3zOVBlFjGztj1NmwtrwXHtlb1WOPlenb7RLlUXSVDlM11LimBqwTYG1zKH2K4X7BGbHQLlDZq1tcWtE9D/htR25Ow1YTDt6mPUIph3mNVOyOylGLq/mJ2verRV0cERTlTXuFRyo9zWjmM4AdFE6r3hFIFIwXqZna9sE2PDMeYwGFy3m/LcW4XgLmZe5+SGYYFTxs5N3XSUmiUFvabqF6DFRXlrz9q7KXRdSkPUXY3WEKmZ113rW7ZuZF65KXDocinmEgrqZheHbyd4xx4CVVqDNcdo55X1gxyA8hVWVLFAjzPINgl+Zf+4jYC/8AwJhppMPdm/QBeY3WhlI4HAf+YS0xyilz+oq05YCo3TL3MVXTrBqEAQes71hfhm4V7xRYwNj/AEluRoBqa9yw1lr+Pt8F8sXcQL9lkXgr4m1hRMrZc9uYpUXN5Wo11X0l8FQxDS47J07QKQtD2vzNhZMeBqGDig0BD5s37JKjh1q96SIe2/RZN9i/kiO8WCUlfXG4vOHl2DZe2IUr1eB5FQ7pURdMMgDAHH24pFClhy/W6u5WwETWcU2y6I3UR3WQU84l6pnBcb0Q86jxGZQMv5IznbEiei17qMkIXZ2TV2Xrq7sftcbOyVsCqct2lT3CtA5OzUAy/k0bVy31cGXnvMHVweZdFC84+Fww6CQXAH2g6gecoLxBnlTPcr+Z270fgd+rh9z7jwNvqKyeHPLTLjpHXMkt6qi5MbltuuHZgjqs9yiXquWMCatHF1le9+oBeboHydu+ZX0oge9pIfzDwutjvk0PCQ66iVNLVuLaxeJVmsD10svIEp88sjPSIOECggb26D5lVWsE7D0e0xMLXw67fELgNFrp37EggBwjLReIW3xv0+IqJOH62zsdIbeXEeqW7j5FimoGi/fymufqp7I5xMMS4L+Oj2jxTLyw8mz35lxLbf2D0pASWaScQSFYYO7Mnqi6O2L9cd45INzbXj+S2YwjT+aP4lAlHX4v0YPaS2K3RtCXwWYDfnIcfLo9wrCxT9K8H5gxz9RXlXl+zQM5nBsVPx4fZDyXIav3l+IIP6T7DDGRViv3rafVR/PLtq8vMq5YPdCWcdHtD5bAaL4drs2TKrzVAbDwOvxGzv37vNxxlUX9h/iKRDhB8dYIeLAW39v4jhA0MTttXzKFqzlR22Q5ZjJivYfyzRaNi9Er7aorRSqVPHSX3f8A43D5Y00LF6mbM6cwcLYRo7bnu4WFwPyH/wAy/Fd1zpG/DHiHnXV/uBMnTCcHUX+naXuY6u9lwfEVLzSx8lgl64zRDtez4GAahxflfejSP2htQr34YUTlgFO2kDjN2u+R4YyKVOb87I9x0BvoZfdRQwN6D4P83AY5gAOh98k8SdA5WWoh0g86zMLuEWnd/wABGbDQnvLAO81Htn6I36lNfdU/MVJ38tcHuoabUsmh2c/NxZ8dET21+agKDsbDqP25TpgbEXeT/HZs2bG5CLsL4uKyaHaGtZ328PwuLcQR77Yn9zMYGgEPqcLGqxhHJF2kG5X3yvidxfB8qgRC2p7axCoqaMXKhNf4vFmzQeA0K8c37+ynrVCFlc3Xq6xNxgLcs7GsNR6mCNl16EA8bWKOQKYekK2a9sQ43LDckLJNVXM2Ac9M4CJfqmCTBxt9xyYTBl1Vhb7gXLQtDXSss4vR/wBhht388+6/FfTBg4FaZwt9xpgu48y2LHs6fQWCGDmOmW9NX2Y9Kp51okb8yjqQ9Dtc9Z/WdD7Kf+06yom2JKQxHIA6Rv8A5MuCA/8AA6+PomKmgy0/4Pol8NIq37g4B45LSoYuHDIOq/3c6ZIVDEF3cBwDSOR3GdsdKk/pO30NIgC14JnDcg6SnDzUCQO9N8lJV01WSYFRCQWz5OFqbVwMGbPJH9Z0PsWfQtRzaRYMY652oPsYLfxERrA29j9Lhpmu2W8uHb6fLjg7V7w4eorBO0d+KLoiw3+gWxcjW+FWgfzK2bERTmjZ9wFklKrsyRjaGn26rwNEwd3Cj1h9jAu97HXpaNGgmAkZLTzUVIWVF8RAZuawmjHIAUlKL2Yz+Bo0bpYXHhgoUQ6AoE0KYoKM0/Y19KlfSvpUqVK/wr61K+lSv9h//9oADAMBAAIAAwAAABAAAAAAAAgAAAgAAAAAAQAAAAATyjxgRAQAAAAAAAAAADjjgCRhQQwAAAAAAAAAASBABADSTwAAAAAAAAAQyTABAwDzCgAAAAAAABRiBBhAwhCAAAAAAAAAAASxAxzzTwgAAAAAAAAQgRAjQQSRAQAAAAAAAAATACiTgBzASAAAAAAAAABDARBRzAAAAAAAAAAAQwwjwDACQAwAAAAAAABTSjjyzDDSjQAAAATAAASwzzwwzzxwygAAACACACBwCBxwDzzzwDxxz//EABQRAQAAAAAAAAAAAAAAAAAAAID/2gAIAQMBAT8QBX//xAAUEQEAAAAAAAAAAAAAAAAAAACA/9oACAECAQE/EAV//8QAJhABAQACAgEEAwEAAwEAAAAAAREAITFBURAgYXEwgZFAocHwsf/aAAgBAQABPxDNZ17f16OXD8t9O8/Xp+vwfr2P4X0UmbcenfsdYr+A/Dx6Ps5zj2AKoAqrxiKIkn3G2xa85MY5SkIEpORyTeI/QOW8glGNOBYdZ3u1zAkBbCmxbcTWQzEEKaqrdCYcbwyurSUitCoFdFxClPHhXcQ1lp5pcXGrDwqgABL0TDF2SRyO2CsStus2t2gYELTfl0zwKKgw5B2Zb7b7/wBZ5/Dv01QSMDVX4AcVwKCjFQJoMKWOfGvargrWgFNcKr2QkjpVhUeGwxE1sTgICbNUFrOKYs0zBDhDzGAOwCpIsQIWGT95B1MDIeFqzETaJdsTW6nlj/RI1WmA2IB5cTFq+1JkSiEBrvDCD+qJMSCkow43hMfXo6Yguiy1Pbl3ZPfZqVN6+9Zbv3bzj2b9nHp37WUFQoecK07SDW8idCGyaZVyLMjle0HG9POsvQj0aQgQOgFS4OsjjCVoiR/PGX+vUPvP0AkD9oMXA5vYEW4UvIQ4qYNEoDRIWKHJcfcQgoUiqTYQ0CYck9t3qQIaZsJWXPQiduCZSGNg3AkKW3EEtvboId4RfR0fQpnYJ/WIRVntMBhi0Oh2YA9ypKnNhhrYEuG8DQioUIs7SghcX1PCSAB0HTge38vHsuvbClXISN5DAlGqHFa4HPFDndnA7qihSGVINoQguw2LLgDOraPicOQYfGTVK81UBHaBUAZaV/zDHzhmlZWhuGwyZAUU9kJCBgRStnjbkNxmhRghElpDbQsUgLRVHBn4ZUzIiTweI2KLWpIKg3uiBOkx6OE2eqvBdQuhcECIhNoSS2iWurHN3cWQQ0gB2VCU1hkoTTcJ68DtDg7norQ9ebHZeTgbQJWqFBjYLbIABkvKWegDpj6X23L6X5zz6de9PjCafVQw2YYHGDJI4ZukB4gpEZCEVyqph9EJwib878cd4IAEOqdt9TKkrNDFPqs4OHljkW6QnZ0kbsXi3C5EAwEBNAw+sUUfsboHTJ2B6HBpmeTnDlPGggQAwVTyEkIkMSckLyZVuEyICPWCJeVNrkTjAqIkEdGVPEjbktM/oJZe1QQOnCMxu6SDVgdXgeXC3UdNJQ7LFOlxmltZaJw9IMjZwxMRhRFdF3l0DAiTRnSQBa6pFA9ODf8AGUqY5aIOkcsqPbn45QHnHGzgwJxEgahiCaavF5bRWiqfB2DsHeMdJLEIEvgXyq951kSGzU3BweVw8cjxkxqiB8yYHFYE00oDc84AfGGyqfdOCOGwNwkGUdJroJXBPSIDV4RWaxb0axQMXThm0UVSHGI4U8pmJCgKonVmNfKmASfIhj9uakAx/wA4m7to87AqfMNpgSxh6LFUNADUG8iHGQIdPnVj7VzjjJ630fTvNet974SXUDAiUt6R1gVlFSGggJBBJQYTUJM41VADz9qw5VDsPKnJpg8JnOtCgNDRN3KJBwJtGoOzR6w86aUxS1UxCTfy7kXkyHlYBKrR6PGFfNTgG1Xowmyki8VUeQccdYfnXi6xBov28YuiKzO4jg7NjxgBSDnP9OmUotlga4Fo2GGhJOjy4NwyR63jbiUHOo1aO4fPS2e2pWpoIii1KxwQ/wAcAqmwmUNpbz5MBEyNVFm4avXhzenTpDcLxd6bK3LdNh8onbY05xMPDVrB4WPhMIbbCq5hwEJqq9YscBi00Jy87aPhnXpHvUTQpeqh9oYxOTACyoRQ5B2lg9sFCD8nUr8Uw04dyJaHjoNLwJgThooEh2qDGzqGCI7gAS/GTIbHedmo65pGYZwuqEkkenIqNtwrK/TEfSbaa/4xUuX/ABKDGxByAjiz0UToWH2GhBvmMODCAOKAw4omim2a0RxlB9Ig5VrwmQw23AYs2wRvQdTOmVoFEzewLV2njI11CYvb2lwHiOEp7kAm/VJ+BHeaGv8AcNB1U0CUhqNUwJG34xmN2Rpq94StGlXvHgSXpDUPFuNbE6R3S/ZHRTmFIinAKEvQVPlg8ZeJZtCqwLDDnWY8oymAiV22abf1CAK3QJl0c98YjSm3TWGGnQgZP8gp0iMA2Zs1BMrMCHrccRA1Yn1K4pQbelNyIAC72d48g86ons5AVON5RWWAK8J+HDp3yd1pa2MgKaGg1dRXzJ/00XA29jkuVnhLQEMcONOLlANUgMh208oYhctbwzfCvMUGYyJcXqBCgAnQZVmVBIbJNDY1mzFhs1ibmEzzGd9ZYDgsmDDtUrtCvOPrKjDxRoUIOEGhsmqQVKIhpym7MDOa1Voems0Lku3Z4AfQaZ+Ln8F9ZckkOX4xzBCuF4GE8yP25t4JUB33e1IprulBTreae3eCBOsjgOdCE2raf41gjvrmWsKqdigBcNDscfoJBglzSaGJJQIqaDanXxJouCOi/AQA5gGS3iOblJIFKxLJMRmo4VGgtPsECmmuqhISehKqmqF2S0eCMNimpIECGjaq3NMYCKIOxQL/ACxv35sATtzYbuhCYOoWomgDtDAywr5SHyVRNJE04E9nHpf8DqlC0At4rDAf1PYYIgXmn7xOwlARVjR8gqm8Kj1UhxYBGl/TCP5f/X02fTFwqJ20H8Yony84gcL/AF4R/cQLU+tyB4x2LNO152KX4woWjwEwcI7MVKeQL2LSC3f9Mgp+YQQorQyCykKuBHdoRG4nHDka1za1FSIeTjCDkvgOETSNE8jhrnAwB4A4/HPZPfMFB4xwwErtrHmVtxMwj5gSe20rPhzYJhDW5pVQItg5oKaiF2V+hQwbu87FUfUAAAIaADnEUGnwkqwk4YfOIm6wUSqSinGtaxyucKZGYbYXREGg1kAC2J6q8km9YHDU0KVaw7Ia1m2MBsRDm7G9B4MNyZgLbmUsBOiNuKN+abrVQaXu4fLJbEAIAdGc/wCOqYijVg8oOWjqdY9qA1eF1lvmmonejUtXfAaBVRhzOr8BxPH1+5IBC9ih5MVBOQwdrkcu281kJEQ0S9unY/WFDyqBEIkjSxGaZlMmbTtTLHyAODwJBsZbztW085E4yATgwLQY4mCg0SgGMXZsw0o42tdsAMiPnGBqkBck2YBlEXNJoBXXYRGABXjBifjOqDkb26wP/FegUBynRAauDL2tilBYodgdcY/1DFGDYXknDjGsEg4Bep0iIojhs9r7O/eRk4FEeRMQCYG/UCwb5JOMI6hdI2oTQloDy4elNZIgsQA4ejEy0bMmigLygEN4OjF0SDpJ2f3EFRb04GZphWCIToOFhyZODDWnUWVm1Ph3irKlJckUg6ORsC4REAoojwjl5YnW4IDlRgZXhBCGmhpRdDhtvCrXGD8FsncA7OseAk+cS0NWDIPjOS0HeGBWxSMGPipxOcSFzOt3Q0qEqJzhhdiNdxdOJ2jvGG2NKUu4p2EPnJuMA1mrbR2rnXuvpcn4EpkQAdiZsRCkbtqildqXLv2NTwNFl7rocaKkKnTsZsNx+8LhInLCVSLtoeDEyEWmVOB0urreANwJwy0wSEjwaWBEhh53p06Z9tgth5NMaplN1vQsRptTDi4s9QsTTseaCZphgI1rQooaJoaw92Lo5zs7fBcmUlxbA3jsdFHCc4Sznh1afQq5zfCShiNO6G1AYluBWYu1G9JS+TBe7Drt0AG1/uEPv493HsnpPWPB/MZwjkxzSVaNiYIcym3YaUO1by6DEo8SAFV0idCY2SgE9VDbdGg8Y8nEFC15bL1vgVC0K9lTlER50y2PEw3pF3yZF2HEGoqQ0AoxM2oqzCwBW9njZnXP0JtLiCapDGCgp8xsQ9ODWJzsbzd6b8TIeDPr2z1nt7/MIVEdInOD/cTT3Zjta0r5z7brvq14HhONC5Pz6xdHmWgOrNXDSoUCycArw0uNlfKZtWqE5h94EYxEaInCf2rwYWaIgwgBoA9r7OPw85Pxl5cwKVDoAFVxShRZ0Y2Z/VwcG2XANJQ3vc3K5uX1oVWqAlHhcrBoaVjweolGD4e8NzzTDCaKq7V+hlx80w5QbNS6I7mAgMUdwUB+p+MNeIKokIbVv6HDh1FsFAaR8n+d3BqVVpS+MYGz6xQ9BShMETKAEM7AClljlKymQWC0gypfnIR+Raf4X7wDACmGjSOwpRSu2HCKODwBp6dqYIgBqeB0idM3b5IFd2bJeWtJhSHpVp/h/M7FjeoU7SSgPzg/GJfNmUqwVfV0i1YpLnDONu1gDoDX0/DPwj0ZybzRyhUeEDgmV4L7LETauiulGmHVlpcdMkWf9J1jmBNyyRorSnW8OLhwCRXhGhXfnBR91Fg3Tkgk3jTOEBQAgODowenw0ekVWkSR+CCH0l8gjCAcndc/Yx1FV+2ukWqvkmziPFWqlbMm4d2naGbefHKQiNSmzzlevo+Q27QFEhN4tbm6JWXxjtIT0lovg1A5w64NQF0dRdUfWElcAOdE0Ar5W3f4nP6/COec1/0MdE3AiKJ/8zqSvO7svrZW5A1hsYl7lBJQC8pEjrjDDqTEaC0Lsr+OI95JZVqIJvAb26Hxm442IiCfpwGAxIOlHwadmuRg3HgojWMRLQK5JooEro40ldKMZimxHurcex5HsTB/6esfrYaNnQCq4QyJQiybYlNxPODZ+y1gFKVKptIs9BpVQMwhW4HHGHmGw0qHtZl2Rq8+jmevPpPSe2exVHgPSAiF1XKtHhlpGNQUIzxnRZCKUEgUut9GbsROFETT21SVTsmTxBl3DlrhzVbRa23GpDJ+O7h44mRiPdWoWAT+mAoWZl5JH0H5wyK91FGKjlWvdxZPUoLQVYcbV+cATjSDdMA7BdbXHTAiiccxTrUxs3SRAVUy7OJmkLbHHA7EMBVv5Dgqjkv6SRXQcAIB0BhKckikDMWgl1xghkNYAWEIIzWA/wBEl8FfhB8tcb9jubjCMY7n4f1iel9J6oX5yGRkZPjIyHjIyMjxkeMnxkMh4yMh4yHjI8ZGQ/8AGRkvn0498xw49H0c7w49Jnfo/g7/ADT2f//Z"
	var doc = new jsPDF();				
	doc.addImage(imgData, 'JPEG', 90, 40, 30,20)
	doc.setFontSize(8);
	//doc.setTextColor(255,0,0);
	//doc.text("Sample PDF Template for Certificate Printing(All data's are dummy).",  60, 10);	
	doc.setTextColor(0,0,0);
	doc.setFont("Lucida Handwriting");
	doc.setFontType("bolditalic");
	doc.setFontSize(16);
	doc.text("NATIONAL UNIVERSITY OF ADVANCED LEGAL STUDIES",  25, 25);							
	doc.setFontType("bold");
	doc.setFontSize(12);
	doc.text("Kochi - 683503",  90, 30);	
	
	//console.log(data);
	
	switch (certificateTypeId) {
		case certMap.get('DEGREE')://Degree Certificate
		    doc.setFontSize(10);
			doc.text(data.certInfo.certificateNumber,  150, 45);
			
			doc.setFont("Monotype Corsiva");
			doc.setFontSize(12);
			doc.setFontType("italic");
			doc.text("Having been examined and declared successful in the Examination",  50, 80);
			doc.text("Prescribed under the Regulation and placed by the Board of Examiners in the",  40, 90);
			doc.setFontSize(14);
			doc.setFontType("bolditalic");
			doc.text("FIRST CLASS", 90, 100);//TODO EXAM NAME
			doc.setFontSize(12);
			doc.setFontType("italic");
			doc.text("and having satisfied the University's requirements",  60, 110);
			doc.text("upon the recommendation",  80, 120);
			doc.text("of the Executive Council of the University,",  70, 130);
			doc.setFontSize(14);
			doc.setFontType("bolditalic");
			doc.text(data.studentInfo.programName, 90, 140);
			doc.setFontSize(12);
			doc.setFontType("italic");
			doc.text("is being conferred on",  80, 150);
			doc.setFontSize(14);
			doc.setFontType("bolditalic");
			doc.text(data.studentInfo.studentName, 90, 160);
			doc.setFontSize(12);
			doc.setFontType("italic");
			doc.text("Given under the seal of University.",  70, 170);
			doc.setFontSize(14);
			doc.setFontType("bold");
			doc.text("Vice-Chancellor",  140, 250);
			doc.setFontSize(14);
			doc.setFontType("bold");
			doc.text("NO:0001323",  25, 250);//TODO DOCUMENT NUMBER
			window.open(doc.output('bloburl'), '_blank');
			newwindow = window.open(doc.output('bloburl'), "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
			break;
		case certMap.get('PROVISIONAL')://Provisional certificate
			doc.setFontSize(10);
			doc.text("SL No.",  130, 45);
			doc.text("Book No.",  30, 45);
			doc.setTextColor(255,0,0);
			doc.text("#8888",  150, 45);
			doc.text("12",  50, 45);
			doc.setTextColor(0,0,0);
			doc.text("Date :"+  moment().format('LL'),  130, 55);
			doc.setFontSize(12);
			doc.setFontType("bold");
			doc.text("PROVISIONAL CERTIFICATE",  75, 75);
			
			doc.setFontSize(12);
			doc.setFontType("italic");
			doc.text("Certified that "+ data.studentInfo.studentName+" candidate with Register No: "+data.studentInfo.regNo+" at the ",  40, 110);
			doc.text(data.studentInfo.programName+" Degree Examination held in JUNE 2020 has passed",  40, 120);
			doc.text("the said Examination in FIRST CLASS.",  40, 130);
			
			doc.setFontSize(12);
			doc.setFontType("bold");
			doc.text("Prepared By",  40, 180);
			
			doc.setFontSize(12);
			doc.setFontType("bold");
			doc.text("Checked By",  40, 200);
			
			doc.setFontSize(10);
			doc.setFontType("bold");
			doc.text("CONTROLLER OF EXAMINATIONS",  140, 200);
			window.open(doc.output('bloburl'), '_blank');
			break;
		case certMap.get('TRANSCRIPT')://Transcript certificate
		  toastr.error(" No template provided for transcript");
			break;
		case certMap.get('MIGRATION')://Migration certificate
			doc.setFontSize(10);
			doc.text(data.certInfo.certificateNumber,  130, 45);
			doc.text("Roll No."+data.studentInfo.rollNo,  130, 50);
			doc.text("Date :"+  moment().format('LL'),  130, 55);
			
			doc.setFontSize(12);
			doc.setFontType("bold");
			doc.text("MIGRATION CERTIFICATE",  70, 75);
			
			doc.setFontSize(12);
			doc.setFontType("italic");
			doc.text("This is to certify that Mr./Ms. "+data.studentInfo.studentName+" (Roll No. "+data.studentInfo.rollNo+") was a ",  40, 110);
			doc.text("bonfide student of this University for the "+data.studentInfo.programName+" Degree Course ",  40, 120);
			doc.text("during the period from 2015 to 2020. ",  40, 130);
			
			doc.text("This University places no restriction on him/her continuing studies in any other",  40, 150);
			doc.text("University/Institution.",  40, 160);
			doc.setFontSize(14);
			doc.setFontType("bold");
			doc.text("REGISTRAR",  140, 200);
			
			window.open(doc.output('bloburl'), '_blank');
			break;
		case certMap.get('TRANSFER')://Transfer certificate
			doc.setFontSize(10);
			doc.text(data.certInfo.certificateNumber,  130, 45);
			doc.text("Roll No."+data.studentInfo.rollNo,  130, 50);
			doc.text("Date :"+  moment().format('LL'),  130, 55);
			
			doc.setFontSize(12);
			doc.setFontType("bold");
			doc.text("TRANSFER CERTIFICATE",  70, 75);
			
			doc.setFontSize(12);
			doc.setFontType("italic");
			doc.text("Name of the student : ",  40, 90);
			doc.text(data.studentInfo.studentName,  120, 90);
			
			doc.text("Date of birth as entered in the  : ",  40, 100);
			doc.text("Admission Register",  40, 105);
			doc.text("12/03/1988",  120, 100);
			
			doc.text("Date on which the student was   : ",  40, 115);
			doc.text("admitted in the University",  40, 120);
			doc.text("12/03/2015",  120, 115);
			
			doc.text("Date on which the student left the   : ",  40, 130);
			doc.text("University",  40, 135);
			doc.text("12/03/2019",  120, 130);
			
			doc.text("Class in which the student studied   : ",  40, 145);
			doc.text("at the time of leaving it	",  40, 150);
			doc.text("10th Semester",  120, 145);
			
			doc.text("Whether the student is qualified for   : ",  40, 160);
			doc.text("promotion to the next higher class	",  40, 165);
			doc.text("Yes",  120, 160);
			
			doc.text("Name of the examination of the   : ",  40, 175);
			doc.text("University for which the student has	",  40, 180);
			doc.text("been last presented		",  40, 185);
			doc.text("Five year B.A. LLB (Hons) Degree",  120, 175);
			
			doc.text("Register Number of the student and   : ",  40, 195);
			doc.text("Month/Year of examination	",  40, 200);
			doc.text("March/2019",  120, 195);
			
			doc.text("Whether the student has appeared for   : ",  40, 210);
			doc.text("the examination	",  40, 215);
			doc.text("Yes",  120, 210);
			
			doc.text("If the student has appeared for    : ",  40, 225);
			doc.text("the examination	",  40, 230);
			doc.text("(a) the parts and division in which ",  40, 235);
			doc.text("    the student has passed	",  40, 240);
			doc.text("(b) the parts and division in which 	",  40, 245);
			doc.text("Course the student has failed	",  40, 250);
			doc.text("Passed B.A. LLB (Hons) Degree ",  120, 225);
			
			doc.setFontSize(14);
			doc.setFontType("bold");
			doc.text("REGISTRAR",  140, 280);
			
			window.open(doc.output('bloburl'), '_blank');
			break;
		case certMap.get('CONDUCT')://Conduct certificate
		    doc.setFontSize(10);
			doc.text(data.certInfo.certificateNumber,  130, 45);
			doc.text("Date :"+  moment().format('LL'),  130, 55);
			doc.setFontSize(12);
			doc.setFontType("bold");
			doc.text("COURSE AND CONDUCT CERTIFICATE",  60, 75);
			doc.setFontSize(12);
			doc.setFontType("italic");
			doc.text("This is to certify that Mr./Ms."+ data.studentInfo.studentName+" (Roll No." + data.studentInfo.rollNo +") was a ",  40, 110);
			doc.text("bonfide student of this University for the "+ data.studentInfo.programName +" Degree Course ",  40, 120);
			doc.text("during the period from 2015 to 2020. ",  40, 130);
			
			doc.text("It is also ceritified that his/her character and conduct during the period were good.",  40, 150);
			doc.setFontSize(14);
			doc.setFontType("bold");
			doc.text("REGISTRAR",  140, 200);
			window.open(doc.output('bloburl'), '_blank');
			break;
		case certMap.get('ATTENDANCE')://Attendance certificate
			break;
		case certMap.get('CONSOLIDATED_MARK_SHEET')://Consolidated Marklist
		   toastr.error(" No template provided for transcript");
			break;
		case certMap.get('NO_DUES')://No Due Certificate
			doc.setFontSize(10);
			doc.text("No.NUALS/AC (B)/03/",  130, 45);
			doc.text("Roll No.LL.B/MIG",  130, 50);
			doc.text("Date :"+  moment().format('LL'),  130, 55);
			
			doc.setFontSize(12);
			doc.setFontType("bold");
			doc.text("NON LIABILITY CERTIFICATE",  70, 75);
			
			doc.setFontSize(12);
			doc.setFontType("italic");
			doc.text("Name of the student : ",  40, 90);
			doc.text("Nimmy George ",  120, 90);					
			
			doc.text("Program : ",  40, 100);
			doc.text("LLB ",  120, 100);
			
			doc.text("Batch : ",  40, 110);
			doc.text("2015-2020 ",  120, 110);
			
			doc.text("Period of Program   : ",  40, 120);
			doc.text("2015-2020 ",  120, 120);
			
			doc.text("Reason for Application  : ",  40, 130);
			doc.text("Admission for Transfer",  120, 130);
			
			doc.text("Total Amount  : ",  40, 140);
			doc.text("1400 Rs/-",  120, 140);
			
			doc.text("Paid Status  : ",  40, 150);
			doc.text("Paid",  120, 150);
			
			
			 // Simple data example
			var head = [['Department', 'Amount']]
			var body = [
			  ['LIBRARY',200],
			  ['Hostel',1200]
			]
			doc.autoTable({ head: head, body: body,margin: {top: 160,left:40},  theme: 'grid',tableWidth: 120 })

			doc.setFontSize(14);
			doc.setFontType("bold");
			doc.text("Registrar",  40, 240);
			doc.text("Vice-Chancellor",  140, 240);

			
			window.open(doc.output('bloburl'), '_blank');
			break;
	}
}