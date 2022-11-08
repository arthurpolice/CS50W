def calorie_calc(age, sex, height, weight, bfat, energy_unit, formula):
    #Calculate user's daily calories based on data
    BMR = 0
    if formula == "0":
        BMR = Mifflin(sex, age, height, weight)
    elif formula == "1":
        BMR = Harris(sex, age, height, weight)
    else:
        BMR = Katch(bfat, weight)
    if energy_unit == "calories":
        return float(BMR) 
    else:
        return float(BMR * 4.1868)


def Mifflin(sex, age, height, weight):
    BMR = (10*weight) + (6.25*height) - (5*age) + 5
    if sex == "female":
        BMR = (10*weight) + (6.25*height) - (5*age) - 161
    return BMR;


def Harris(sex, age, height, weight):
    BMR = (13.397*weight) + (4.799*height) - (5.677*age) + 88.362
    if sex == "female":
        BMR = (9.247*weight) + (3.098*height) - (4.330*age) + 447.593
    return BMR


def Katch(bfat, weight):
    BMR = 370 + 21.6*(1 - (bfat/100))*weight
    return BMR