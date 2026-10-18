package com.example.diary.repositories;

import com.example.diary.models.Role;
import com.example.diary.models.Sclass;
import com.example.diary.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findById(Integer id);

    Optional<User> findByUsername(String name);

    Optional<User> findByEmail(String email);

    Optional<User> findBySclass(Sclass sclass);

    List<User> findByUsernameStartingWith(String name);

    List<User> findByUserrole(Role role);

    Page<User> findByUsernameStartingWith(String name, Pageable pageable);

    Page<User> findByUserroleAndUsernameStartingWith(Role role, String name, Pageable pageable);

    Boolean existsByUsername(String name);

    Boolean existsByEmail(String email);


}
